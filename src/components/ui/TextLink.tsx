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
      className={`inline-block text-fg no-underline hover:underline active:text-surface ${className}`.trim()}
      {...rest}
    >
      {children}
    </Link>
  );
}
