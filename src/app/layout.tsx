import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthProvider";
import { DevToolsLoader } from "@/components/debug/DevToolsLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              {process.env.APP_ENV === 'local' && <DevToolsLoader />}
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
