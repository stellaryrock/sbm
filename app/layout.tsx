import { BookMarkedIcon, SquareLibraryIcon } from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="container mx-auto flex h-screen flex-col justify-center">
          <header className="flex justify-between border-green-400 border-b-1">
            <Link
              href="/"
              className="flex items-center font-semibold text-3xl text-green-500 tracking-tight"
            >
              <BookMarkedIcon size={28} /> BookMark
            </Link>
            <div className="flex items-center gap-5">
              <Link
                href="/bookcase"
                className="rounded-full border p-1 hover:ring-1 hover:ring-blue-500 [&>svg]:stroke-blue-500"
              >
                <SquareLibraryIcon />
              </Link>
              <Link href="/login">Login</Link>
              <Link href="/my">My</Link>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="text-center text-green-500">
            &#169; indiflex SeniorCoding 2025
          </footer>
        </div>
      </body>
    </html>
  );
}
