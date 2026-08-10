import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const switzer = localFont({
  src: "../../public/fonts/Switzer-Variable.woff2",
  variable: "--font-switzer",
  display: "swap",
  weight: "100 900",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: "Kristina Bekher",
  description: "Kristina Bekher is a Ukrainian photographer and software developer based in Germany. The website is a portfolio of her photography work.",
  openGraph: {
    title: "Kristina Bekher",
    description: "Kristina Bekher is a Ukrainian photographer and software developer based in Germany. The website is a portfolio of her photography work.",
    images: [
      {
        url: "https://d14lj85n4pdzvr.cloudfront.net/hero-1200.jpg",
        width: 1200,
        height: 630,
        alt: "Kristina Bekher",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kristina Bekher",
    description: "Kristina Bekher is a Ukrainian photographer and software developer based in Germany. The website is a portfolio of her photography work.",
    images: ["https://d14lj85n4pdzvr.cloudfront.net/hero-256.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={switzer.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
