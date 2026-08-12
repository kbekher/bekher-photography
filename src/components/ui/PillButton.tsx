import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  className?: string;
  active?: boolean;
};

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    as?: "link";
    href: string;
  };

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    as: "button";
    href?: never;
  };

export type PillButtonProps = LinkProps | ButtonProps;

const BASE =
  "inline-flex h-[31px] cursor-pointer items-center justify-center rounded-pill px-8 py-[6px] text-center " +
  "transition-colors duration-150 ease-out active:bg-surface " +
  "disabled:bg-surface disabled:cursor-not-allowed";

// Hover only lightens an *inactive* pill — an active pill is already at full
// --color-surface and must not wash out when the pointer is over it.
const INACTIVE = "hover:bg-surface-hover";

/**
 * The 31px / radius-17 nav pill. Renders as a Next `<Link>` when given an
 * `href` (default), or as a `<button>` when `as="button"`.
 *
 * States (per spec §2):
 *  - default: transparent bg
 *  - hover: --color-surface-hover (#EFEFEF @ 50%)
 *  - active (current page) / press: --color-surface (#EFEFEF)
 *  - disabled: --color-surface, non-interactive
 */
export default function PillButton(props: PillButtonProps) {
  const { children, className = "", active, ...rest } = props;
  const activeClass = active ? "bg-surface" : INACTIVE;
  const classes = `${BASE} ${activeClass} ${className}`.trim();

  if (props.as === "button") {
    // `as` is a discriminator for this component only — strip it so it never
    // reaches the DOM as an unknown attribute.
    const { as: _as, ...buttonRest } = rest as ButtonProps;
    void _as;
    return (
      <button
        type="button"
        className={classes}
        aria-pressed={active}
        {...(buttonRest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  const { href, ...linkRest } = rest as LinkProps;
  return (
    <Link
      href={href}
      className={classes}
      aria-current={active ? "page" : undefined}
      {...(linkRest as AnchorHTMLAttributes<HTMLAnchorElement>)}
    >
      {children}
    </Link>
  );
}
