import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion'

interface LogoProps {
  isLink: boolean;
}

interface LogoElementProps {
  color: string;
}
const LogoElement = ({ color }: LogoElementProps) => (
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1,
    }}
    className={`w-5 h-5 rounded-full ${color}`}
  />
)

const Logo = ({ isLink }: LogoProps) => {
  const pathname = usePathname();

  const text = pathname !== "/" ? "Home" : "Kristina Bekher";

  return isLink ? (
    <Link
      href="/"
      aria-label="Go to homepage"
      className="flex gap-2 items-center text-white xl:text-[24px] custom-transition hover:text-[var(--accent)]"
    >
      <LogoElement color="bg-[var(--secondary)]" />
      <span className=''>{text}</span>
    </Link>
  ) : (
    <div className="flex gap-2 items-center select-none xl:text-[24px]">
      <LogoElement color="bg-[var(--branding)]" />
      <span>Kristina Bekher</span>
    </div>
  );
};

export default Logo;