import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion'

interface LogoProps {
  isLink: boolean;
  color: string;
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
    className={`w-5 h-5 rounded-full bg-[var(--${color})]`}
  />
)

const Logo = ({ isLink, color }: LogoProps) => {
  const pathname = usePathname();

  return isLink ? (
    <Link 
      href="/"
      aria-label="Go to homepage" 
      className="flex gap-2 items-center text-white xl:text-[24px]"
    >
      <LogoElement color={color} />
      <span>{pathname !== "/" ? "Home" : "Kristina Bekher"}</span>
    </Link>
  ) : (
    <div className="flex gap-2 items-center select-none xl:text-[24px]" >
      <LogoElement color={color} />
      <span>Kristina Bekher</span>
    </div>
  );
};

export default Logo;