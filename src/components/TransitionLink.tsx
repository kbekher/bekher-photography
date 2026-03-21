"use client";

import { motion } from "framer-motion";
import Link, { LinkProps } from "next/link";
import React from "react";
import { useMenu } from "@/contexts/MenuContext";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  dataCursor?: string;
  ariaLabel?: string;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  className,
  dataCursor,
  ariaLabel,
  ...props
}) => {
  const { isOpen, closeMenu } = useMenu();

  const handleClick = () => {
    // Close menu if it's open
    if (isOpen) {
      closeMenu();
    }
  };

  return (
    <Link {...props} href={href} onClick={handleClick} data-cursor={dataCursor} aria-label={ariaLabel}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={className}
      >
        {children}
      </motion.div>
    </Link>
  );
};