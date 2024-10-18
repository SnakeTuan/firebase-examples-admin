import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from 'next/font/google'
import Link from "next/link";
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto">
              <ul className="flex space-x-4">
                <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
                <li><Link href="/database" className="hover:text-gray-300">Firebase Database</Link></li>
                <li><Link href="/storage" className="hover:text-gray-300">Firebase Storage</Link></li>
              </ul>
            </nav>
          </header>
          <main className="flex-grow container mx-auto p-4">
            {children}
          </main>
          <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto text-center">
              © 2023 AI Generator SaaS. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
