"use client";

import { useRouter } from "next/navigation";
import { useTransitionContext } from "../contexts/TransitionContext";

interface Props {
  href: string;
  children: React.ReactNode;
  beforeNavigate?: () => Promise<void>;
  className?: string;
}

const TransitionLink = ({ href, children, beforeNavigate, className }: Props) => {
  const router = useRouter();
  const { startTransition } = useTransitionContext();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (beforeNavigate) {
      await beforeNavigate(); // wait for menu close
    }

    startTransition(href, () => router.push(href));
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default TransitionLink;
