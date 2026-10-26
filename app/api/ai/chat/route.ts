import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeRuleBasedCopilot } from "@/server/services/copilotService";

export const dynamic = "force-dynamic";

// AI Copilot Model Configuration: Ordered by speed and efficiency (fastest first).
// If any model is retired, returns an error, or times out, it gracefully falls through
// to the next model in the array, and ultimately to the grounded rule-based engine.
const COPILOT_MODELS: readonly string[] = [
  "gemini-3.5-flash-lite", // Fast sub-second primary model
  "gemini-3.5-flash",      // Standard flash fallback
  "gemini-3.8-flash",      // Extended reasoning fallback
];

// In-memory rate limiting map: userId -> timestamps array
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 25; // max 25 queries per minute

  const timestamps = (rateLimitMap.get(userId) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(userId, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!checkRateLimit(session.id)) {
      return NextResponse.json(
        { success: false, error: "Rate limit reached. Please wait a moment before sending another message." },
        { status: 429 }
      );
    }

    const body = await req.json();
    let query = String(body.query || "").trim();

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    // Sanitize query to prevent prompt injection or excessive payload
    if (query.length > 500) {
      query = query.slice(0, 500);
    }
    // Remove control characters
    query = query.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    // Read key strictly from process.env.GEMINI_API_KEY without format validation
    const geminiKey = (process.env.GEMINI_API_KEY || "").trim();
    let replyText = "";
    let answeredByGemini = false;
    let fallbackReason = "";

    if (geminiKey) {
      try {
        // First get grounded tool result from live DB
        const toolGroundedResult = await executeRuleBasedCopilot(query, session);

        const prompt = `You are the LeadTrack AI Counselor Assistant for an educational institution.
You strictly answer admissions management questions, lead pipeline metrics, counselor tasks, and in-app instructions.
CRITICAL RULES:
1. ONLY use the following verified database and system information to answer. Never invent or hallucinate student names, phone numbers, courses, or figures.
2. If there is no data or zero leads, state so clearly and recommend the next actionable step.
3. If the user asks an off-topic or general knowledge question not related to educational admissions, counseling, leads, or this app (such as 'What is the capital of France?', jokes, cooking, coding, weather), politely decline by stating you are the LeadTrack AI admissions counselor assistant and can only help with admissions and lead management.
4. Keep the tone professional, encouraging, and actionable for academic admissions officers.
5. If the user asks in Tanglish (Tamil in English script) or Tamil, answer helpfully in polite English or matching Tanglish, keeping all metrics and instructions clear.
6. Format lead names as markdown links if provided.

VERIFIED CONTEXT FROM LIVE DATABASE:
"""
${toolGroundedResult}
"""

USER QUESTION: ${query}

Provide a concise, helpful response using ONLY the verified context:`;

        for (const model of COPILOT_MODELS) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 800,
                  },
                }),
                signal: AbortSignal.timeout(6000), // 6 sec timeout per model
              }
            );

            if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
              if (text) {
                replyText = text;
                answeredByGemini = true;
                break;
              }
            } else {
              fallbackReason = `${model}: HTTP ${geminiRes.status}`;
            }
          } catch (modelErr: any) {
            const isTimeout = modelErr?.name === "TimeoutError" || modelErr?.name === "AbortError";
            fallbackReason = `${model}: ${isTimeout ? "timeout" : "network error"}`;
          }
        }
      } catch (e: any) {
        fallbackReason = "context generation error";
      }
    } else {
      fallbackReason = "no GEMINI_API_KEY";
    }

    // Fallback to grounded local rule-based intent engine if Gemini did not answer
    if (!replyText) {
      replyText = await executeRuleBasedCopilot(query, session);
    }

    // Short non-secret server log line stating engine and fallback reason (status code only)
    if (answeredByGemini) {
      console.log("[AI Copilot] Engine: gemini answered");
    } else {
      console.log(`[AI Copilot] Engine: rule-based answered (fallback reason: ${fallbackReason})`);
    }

    const wantsStream = body.stream === true;

    if (wantsStream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Split into words / chunks for smooth token streaming
          const chunks = replyText.split(/(\s+)/);
          for (const chunk of chunks) {
            if (chunk) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
              await new Promise((r) => setTimeout(r, 12));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        response: replyText,
      },
    });
  } catch (err: any) {
    console.error("AI Chat API error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "I encountered a temporary issue processing your query. Please try again.",
      },
      { status: 500 }
    );
  }
}
