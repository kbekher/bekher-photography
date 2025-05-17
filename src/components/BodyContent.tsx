// src/components/BodyContent.tsx
'use client';

import { montserrat } from "@/utils/fonts";
import ClientLayout from "@/components/ClientLayout";

// const montserrat = Montserrat({ subsets: ["latin"] });

export default function BodyContent({ children }: { children: React.ReactNode }) {
  return (
    <body className={montserrat.className}>
      <div className="antialiased scroll-smooth bg-[var(--background)] text-[var(--secondary)] font-bold tracking-[0.5px]">
        <ClientLayout>{children}</ClientLayout>
      </div>
    </body>
  );
}