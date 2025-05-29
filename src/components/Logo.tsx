import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion'
import ApertureLogo from './ApertureLogo';

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
      rotate: [0, 30, 0]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatDelay: 5,
    }}
  >
    <ApertureLogo color={color} />


  </motion.div>
)

const Logo = ({ isLink }: LogoProps) => {
  const pathname = usePathname();

  const text = pathname !== "/" ? "Home" : "Kristina Bekher";

  return isLink ? (
    <Link
      href="/"
      aria-label="Go to homepage"
      className="flex gap-2 items-center text-white 2xl:text-xl custom-transition hover:text-[var(--accent)]"
      data-cursor="text"
    >
      <LogoElement color="#cbcbcf" />
      <span className=''>{text}</span>
    </Link>
  ) : (
    <div 
      className="flex gap-2 items-center select-none 2xl:text-xl"
      data-cursor="text"
    >
      <LogoElement color="#444251" />
      <span >Kristina Bekher</span>
    </div>
  );
};

export default Logo;