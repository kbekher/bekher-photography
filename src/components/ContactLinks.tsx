import { motion } from "framer-motion";

interface Props {
  isFooter?: boolean;
}

const CONTACTS = [
  { name: 'Behance', href: 'https://www.behance.net/kristinabekher' },
  { name: 'Instagram', href: 'https://instagram.com/ninjagexly' },
  { name: 'Linkedin', href: 'https://www.linkedin.com/in/kristina-bekher' },
];

const ContactLinks = ({ isFooter = false }: Props) => {

  return (
    <div className={`flex ${isFooter ? "flex-col" : "flex-row gap-5"} w-full`}>
      {CONTACTS.map(({ name, href }) => (
        <motion.a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.95 }}
          className='w-max custom-transition hover:text-[var(--accent)]'
          aria-label={`Visit ${name}`}
          data-cursor="text"
        >
          {name}
        </motion.a>
      ))}
    </div>
  );
};

export default ContactLinks;
