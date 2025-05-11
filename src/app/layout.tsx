import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { HtmlAttributesProvider } from "@/components/providers/html-attributes-provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Torch Group",
  description: "Your trusted partner in digital transformation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="extension-protection" content="no-inject-bybit-attributes" />
      </head>
      <body className={inter.className}>
        <HtmlAttributesProvider />
        <Header />
        {children}
        <Footer />
        <ToasterProvider />
      </body>
    </html>
  );
}
