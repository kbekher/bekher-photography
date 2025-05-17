// src/app/layout.tsx
import type { Metadata } from "next";
// import { montserrat } from "@/utils/fonts";
import "./globals.css";
import BodyContent from "@/components/BodyContent";

export const metadata: Metadata = {
  title: "Kristina Bekher",
  description: "Virtual Gallery of a Film Photography",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <BodyContent>{children}</BodyContent>
    </html>
  );
}