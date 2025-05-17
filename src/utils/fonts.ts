// src/utils/fonts.ts
import { Montserrat } from "next/font/google";

export const montserrat = Montserrat({ 
  subsets: ["latin"],
  display: 'swap', // Add this to ensure consistent loading
});