import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Montserrat } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Kristina Bekher",
  description: "Kristina Bekher | Film Photography Gallery",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  display: 'swap',
});


export function Head() {
  return (
    <>
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-title" content="Kristina Bekher | Film Photography Gallery" />
      <link rel="manifest" href="/site.webmanifest" />
    </>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <CustomCursor />

        <div className="antialiased scroll-smooth bg-[var(--background)] text-[var(--secondary)] font-bold tracking-[0.5px] relative">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}