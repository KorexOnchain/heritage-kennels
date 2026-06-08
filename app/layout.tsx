import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Heritage Kennels | The Farmer's Dog",
  description: "Premium Labrador Retrievers, Poodles & German Shepherds. Raised with love in Dallas, Texas. Nationwide delivery available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-nunito)]">{children}</body>
    </html>
  );
}