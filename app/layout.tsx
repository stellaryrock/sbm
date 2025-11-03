import AlerterProvider from "@/hooks/contexts/alerter";
import { StoreProvider } from "@/hooks/contexts/store";
import { auth } from "@/lib/auth";
import { BookMarkedIcon } from "lucide-react";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { use } from "react";
import ThemeProvider from "../components/theme-provider";
import "./globals.css";
import Nav from "./nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book & Mark",
  description: "Social Book Mark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = use(auth());
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <AlerterProvider>
              <div className="flex h-screen flex-col">
                {/* 모바일 헤더 겹침 */}
                <header className="flex justify-between border-b px-2">
                  <Link
                    href="/"
                    className="flex items-center font-semibold text-3xl text-green-500 tracking-tight"
                  >
                    <BookMarkedIcon size={28} /> BookMark
                  </Link>
                  <Nav />
                </header>
                <StoreProvider>
                  <main className="overflow-auto px-2 sm:flex-1">{children}</main>
                </StoreProvider>
                <footer className="text-center text-green-500">
                  &#169; indiflex SeniorCoding 2025
                </footer>
              </div>
            </AlerterProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
