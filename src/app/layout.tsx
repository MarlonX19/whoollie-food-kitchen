import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { MainNav } from "@/components/layout/main-nav";
import { UserUnit } from "@/components/layout/user-unit";
import "./globals.css";
import { LogoutButton } from "./logout-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whoollie Food Kitchen",
  description: "Backoffice para bares e restaurantes (MVP)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-50`}>
        <header className="sticky top-0 z-10 border-b border-amber-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <Link href="/dashboard" className="text-lg font-semibold text-amber-700">
              Whoollie Kitchen
            </Link>
            <div className="flex items-center gap-3">
              <MainNav />
              <UserUnit />
            </div>
            <LogoutButton />
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
        <footer className="mx-auto max-w-6xl p-4 text-xs text-zinc-500">
          © {new Date().getFullYear()} Whoollie — Demo
        </footer>
      </body>
    </html>
  );
}
