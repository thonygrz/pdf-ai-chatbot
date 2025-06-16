import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

// Load Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] });

// Metadata for SEO and browser tabs
export const metadata: Metadata = {
  title: "AI Knowledge Assistant",
  description: "Chat-based assistant with memory and PDF knowledge integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
