import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Montserrat } from "next/font/google";

export const metadata: Metadata = {
  title: "Kristina Bekher",
  description: "Virtual Gallery of a Film Photography",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  display: 'swap',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <div className="antialiased scroll-smooth bg-[var(--background)] text-[var(--secondary)] font-bold tracking-[0.5px]">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}