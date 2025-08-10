import type { Metadata } from "next";
import "./globals.css";
import { BackToTop } from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Key Generator - Generate Secure Keys & Secrets Online",
  description: "Generate cryptographically secure keys, API keys, passwords, UUIDs, JWT secrets, and more. Fast, secure, and free key generation tool for developers.",
  keywords: "key generator, API key, JWT secret, UUID generator, password generator, secure keys, cryptographic keys",
  authors: [{ name: "Key Generator Team" }],
  metadataBase: new URL('https://key-generator.com'),
  openGraph: {
    title: "Key Generator - Generate Secure Keys & Secrets Online",
    description: "Generate cryptographically secure keys, API keys, passwords, UUIDs, JWT secrets, and more. Fast, secure, and free.",
    url: 'https://key-generator.com',
    siteName: 'Key Generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Key Generator - Generate Secure Keys & Secrets Online",
    description: "Generate cryptographically secure keys, API keys, passwords, UUIDs, JWT secrets, and more. Fast, secure, and free.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
