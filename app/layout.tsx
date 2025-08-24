import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: "SalesAI - AI-Driven Scheduling & Outreach Platform",
  description:
    "Book more calls, qualify leads, and close deals faster with intelligent automations. Smart scheduling, WhatsApp AI flows, and meeting intelligence all in one platform.",
  keywords:
    "AI scheduling, sales automation, lead qualification, meeting intelligence, WhatsApp automation",
  authors: [{ name: "SalesAI Team" }],
  openGraph: {
    title: "SalesAI - AI-Driven Scheduling & Outreach Platform",
    description:
      "Book more calls, qualify leads, and close deals faster with intelligent automations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalesAI - AI-Driven Scheduling & Outreach Platform",
    description:
      "Book more calls, qualify leads, and close deals faster with intelligent automations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
