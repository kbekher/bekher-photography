import TextLink from "./TextLink";

/**
 * 235x54 footer block, centered: Instagram + email row, then the copyright line.
 */
export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-16 text-center">
      <div className="flex items-center gap-[10px]">
        <TextLink href="https://instagram.com/ninjagexly" target="_blank" rel="noopener noreferrer">
          Instagram
        </TextLink>
        <TextLink href="mailto:krbekher@gmail.com">krbekher@gmail.com</TextLink>
      </div>
      <p>ⓒ2026 Kristina Bekher</p>
    </footer>
  );
}
