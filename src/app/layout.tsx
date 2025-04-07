import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import Preloader from "@/components/Preloader";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { TransitionProvider } from "@/contexts/TransitionContext";
import { MenuProvider } from "@/contexts/MenuContext";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Kristina Bekher",
  description: "Digital Gallery of Film Photography",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <TransitionProvider>
          <Preloader />
          <PageTransition>
            <MenuProvider>
              <Header />
              <Navigation />
            </MenuProvider>
            <main>{children}</main>
            <Footer />
          </PageTransition>
        </TransitionProvider>
      </body>
    </html>
  );
}
