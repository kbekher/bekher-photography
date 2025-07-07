interface Props {
  isFooter?: boolean;
}

const CONTACTS = [
  { name: 'GitHub', href: 'https://github.com/kbekher' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kristina-bekher' },
  { name: 'Instagram', href: 'https://instagram.com/ninjagexly' },
];

const ContactLinks = ({ isFooter = false }: Props) => {

  return (
    <div className={`flex ${isFooter ? "flex-col" : "flex-row gap-5"} w-[50%]`}>
      {CONTACTS.map(({ name, href }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className='w-max custom-transition hover:text-[var(--accent)]'
          aria-label={`Visit ${name}`}
          data-cursor="text"
        >
          {name}
        </a>
      ))}
    </div>
  );
};

export default ContactLinks;
