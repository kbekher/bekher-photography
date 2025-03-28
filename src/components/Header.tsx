import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 mx-5 md:mx-[60px] py-[50px] flex justify-between z-10">
      <div>
        <Link href="/">[Logo] Kristina Bekher</Link>
      </div>

      <button>Menu</button>
    </header>
  )
}

export default Header;
