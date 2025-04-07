import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import Preloader from "@/components/Preloader";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { TransitionProvider } from "@/contexts/TransitionContext";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

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
            <Header />
            <main>{children}</main>
            <Footer />
          </PageTransition>
        </TransitionProvider>
      </body>
    </html>
  );
}
