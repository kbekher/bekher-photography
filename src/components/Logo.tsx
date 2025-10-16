// import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion'
import ApertureLogo from './ApertureLogo';
import { TransitionLink } from './TransitionLink';

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
    <TransitionLink
      href="/"
      ariaLabel="Go to homepage"
      className="flex gap-2 items-center text-white lg:text-xl custom-transition"
      dataCursor="text"
    >
      <LogoElement color="#cbcbcf" />
      <span className=''>{text}</span>
    </TransitionLink>
  ) : (
    <div
      className="flex gap-2 items-center lg:text-xl hover:cursor-text"
      data-cursor="text"
    >
      <LogoElement color="#444251" />
      <span >Kristina Bekher</span>
    </div>
  );
};

export default Logo;