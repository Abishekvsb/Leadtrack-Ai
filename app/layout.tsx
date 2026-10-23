import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-context";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#D62828",
};

export const metadata: Metadata = {
  title: "LeadTrack AI – Intelligent Lead Management for Educational Institutions",
  description:
    "Production-grade, AI-driven student enquiry management, lead scoring, and admissions pipeline platform supporting UN SDG 4 (Quality Education).",
  manifest: "/manifest.json",
  keywords: [
    "lead management",
    "education crm",
    "admissions crm",
    "student enquiry",
    "lead scoring",
    "SDG 4",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground selection:bg-[#FFC21A]/30 selection:text-foreground">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
