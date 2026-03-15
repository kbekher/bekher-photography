import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}