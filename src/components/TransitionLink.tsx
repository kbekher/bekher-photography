"use client";

import Link, { LinkProps } from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMenu } from "@/contexts/MenuContext";
import { usePageTransition } from "@/contexts/PageTransitionContext";


interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  dataCursor?: string;
  ariaLabel?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  className,
  dataCursor,
  ariaLabel,
}) => {
  const router = useRouter();
  const { isOpen, closeMenu } = useMenu();
  const { startTransition, endTransition } = usePageTransition();
  const pathname = usePathname();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();    
    // Close menu if it's open
    if (isOpen) {
      closeMenu();

    if (pathname === href) return;

      // Wait a bit for menu to start closing
      await sleep(300);
    }
    if (pathname === href) return;
    
    // Start the page transition
    startTransition();

    await sleep(800);
    router.push(href);
    await sleep(400);

    endTransition();
  };

  return (
    <Link href={href} onClick={handleTransition} className={className} data-cursor={dataCursor} aria-label={ariaLabel}>
      {children}
    </Link>
  );
};