import { motion } from "framer-motion";
import { useMenu } from "@/contexts/MenuContext";
import { textVariants } from "@/constants/animations";
import { useCursor } from "@/contexts/CursorContext";

interface Props {
  text: string;
}

const MenuToggle = ({ text }: Props) => {
  const { toggle, isOpen } = useMenu();
  const { setCursorStyle, resetCursorStyle } = useCursor();

  return (
    <div className={`fixed p-5 top-0 right-0 z-70`}>
      <motion.button
        onClick={toggle}
        className="bg-transparent border-none cursor-pointer capitalize text-white 2xl:text-[24px]"
      >
        <motion.span
          variants={textVariants}
          initial={false}
          animate={isOpen ? "open" : "closed"}
          whileHover={{
            color: "#8d89a3",
            transition: { duration: 0.3 },
          }}
          onMouseEnter={() => setCursorStyle({ variant: "text" })}
          onMouseLeave={resetCursorStyle}
        >
          {text}
        </motion.span>
      </motion.button>
    </div>
  );
}

export default MenuToggle;