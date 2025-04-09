import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { MenuProvider } from "@/contexts/MenuContext";

import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kristina Bekher",
  description: "Digital Gallery of Film Photography",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <div className=" antialiased scroll-smooth bg-[var(--background)] text-[var(--foreground)] font-bold tracking-[0.5px]">
          <Preloader />
          <MenuProvider>
            <Header />
            <Navigation />
          </MenuProvider>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
