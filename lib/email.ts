import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailParams): Promise<{ success: boolean; mocked?: boolean }> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "LeadTrack AI <admissions@leadtrack.ai>";

  // If SMTP is not actively configured or is example placeholder, log beautifully to console
  if (!host || !user || !pass || host.includes("example.com")) {
    console.log("📨 [MOCK EMAIL DISPATCHED] ===================");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`From: ${from}`);
    console.log(`Body:\n${text || html}`);
    console.log("==============================================");
    return { success: true, mocked: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: html || text,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Email sending failed, fallback to mock log:", error);
    return { success: true, mocked: true };
  }
}
