import { motion } from "framer-motion";
import { useMenu } from "@/contexts/MenuContext";
import { textVariants } from "@/constants/animations";

interface Props {
  text: string;
}

const MenuToggle = ({ text }: Props) => {
  const { toggle, isOpen } = useMenu();

  return (
    <div className={`fixed p-5 top-0 right-0`}>
      <motion.button
        onClick={toggle}
        className="bg-transparent border-none cursor-pointer capitalize text-white lg:text-xl"
      >
        <motion.span
          variants={textVariants}
          initial={false}
          animate={isOpen ? "open" : "closed"}
          whileHover={{
            color: "#8d89a3",
            transition: { duration: 0.3 },
          }}
          data-cursor="text"
        >
          {text}
        </motion.span>
      </motion.button>
    </div>
  );
}

export default MenuToggle;