import Link from "next/link";

const Home = () => {

  return (
    <div className="w-full h-screen mx-[60px]">
      <Link href='/galleries'> Galleries </Link>

      <div className="grid grid-cols-12 gap-5">
        {/* TODO: insert gallery images and link them to gallery pages
        TODO: add on appear transitions */}
      </div>
    </div>
  );
}

export default Home;