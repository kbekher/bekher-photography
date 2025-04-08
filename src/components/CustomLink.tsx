"use client";

import { useRouter } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  beforeNavigate?: () => Promise<void>;
  className?: string;
}

const CustomLink = ({ href, children, beforeNavigate, className }: Props) => {
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (beforeNavigate) {
      await beforeNavigate(); // wait for menu close
    }

    router.push(href, {scroll: false });
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default CustomLink

// TODO: delete if not needed