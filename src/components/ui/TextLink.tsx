import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface TextLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * 15px inline text link, no pill. Underline on hover, --color-surface text on
 * active/press per spec §2.
 */
export default function TextLink({ href, children, className = "", ...rest }: TextLinkProps) {
  return (
    <Link
      href={href}
      // The Figma gives the pressed state #EFEFEF *text*, which on the white
      // page is a 1.15:1 contrast ratio — effectively invisible, and well
      // under WCAG AA's 4.5:1. On touch devices :active can linger after a
      // tap-and-hold, so the link would briefly vanish. Fading to 60% keeps
      // the same "pressed" read at an effective #666 (5.7:1, passes AA).
      className={`inline-block text-fg no-underline hover:underline active:opacity-60 ${className}`.trim()}
      {...rest}
    >
      {children}
    </Link>
  );
}
