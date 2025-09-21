import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
      <nav className="flex justify-evenly items-center p-3 ">
        <h1 className="text-2xl font-bold text-[#5e45cd]">CarStat</h1>
        <ul className="flex justify-center items-center gap-5">
          <li className="hover:text-[#5e45cd] cursor-pointer">
            <Link href={"/"}>Home</Link>
          </li>
          <li className="hover:text-[#5e45cd] cursor-pointer">
            <Link href="/single-comparison">Single Comparison</Link>
          </li>
          <li className="hover:text-[#5e45cd] cursor-pointer">
            Bulk Comparison
          </li>
        </ul>
        <Image
          src="/images/darkmode-icon.svg"
          width={16}
          height={16}
          alt="dark mode icon"
          className="cursor-pointer transform hover:scale-110 transition duration-200"
        />
      </nav>
    </header>
  );
};

export default Header;
