'use client';

import React from "react";
import { Montserrat } from "next/font/google";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MenuProvider } from "@/contexts/MenuContext";
import { PageTransitionProvider } from "@/contexts/PageTransitionContext";

import { PageTransition } from "@/components/PageTransition";
// import PreloaderWrapper from "@/components/PreloaderWrapper";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={montserrat.className}>
      <div className="antialiased scroll-smooth bg-[var(--background)] text-[var(--secondary)] font-bold tracking-[0.5px]">
        <div className="relative min-h-screen">
          <PageTransitionProvider>
            <MenuProvider>
              {/* // TODO: fix preloader!!  */}
              {/* <PreloaderWrapper /> */}
              <Header />
              <Navigation />
              <PageTransition />
              {children}
              <Footer />
            </MenuProvider>
          </PageTransitionProvider>
        </div>
      </div>
    </main>
  );
}