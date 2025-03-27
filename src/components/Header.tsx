import Link from "next/link";

const Header = () => {
  return (
      <header className="sticky top-0 mx-[60px] py-[50px] flex justify-between">
        <Link href="/">[Logo] Kristina Bekher</Link>

        <button>Menu</button>
      </header>
  )
}

export default Header;
