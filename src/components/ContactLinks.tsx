import React from 'react';

interface Props {
  isFooter?: boolean;
}

const CONTACTS = [
  { name: 'LinkedIn', shortName: 'LN', href: 'https://www.linkedin.com/in/kristina-bekher' },
  { name: 'Instagram', shortName: 'IN', href: 'https://instagram.com/ninjagexly' },
  { name: 'Telegram', shortName: 'TG', href: 'https://t.me/ninjagexly' },
];

const ContactLinks = ({ isFooter = false }: Props) => {
  return (
    <div className={`flex ${isFooter ? "flex-col" : "flex-row"} gap-5 w-[50%]`}>
      {CONTACTS.map(({ name, shortName, href }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-max ${!isFooter ? 'transition-smooth hover:text-[var(--accent)]' : ''}`}
          aria-label={`Visit ${name}`}
        >
          {isFooter ? shortName : name}
        </a>
      ))}
    </div>
  );
};

export default ContactLinks;
