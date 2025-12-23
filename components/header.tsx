import { Button } from "@/components/ui/button";
import { LinkBreakIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
const Header = () => {
  return (
    <header className="flex justify-between items-center w-full py-6 px-20">
      <div className="flex items-center space-x-2 mb-5">
        <Image
          src="/logo.svg"
          alt="user"
          width={20}
          height={20}
          className="rounded-none border-black"
        />
        <span className="text-white text-xl font-semibold">Axle</span>
      </div>
      <nav className="flex items-center space-x-10 text-white/50 font-medium">
        <a href="#" className="hover:text-base transition-colors">
          Docs
        </a>
        <a href="#" className="hover:text-base transition-colors">
          Features
        </a>
        <a href="#" className="hover:text-base transition-colors">
          Pricing
        </a>
        <Link href="/auth" className="bg-base text-white font-semibold text-[16px] rounded-full px-9 py-4 hover:bg-base transition-all">
          Check it out
        </Link >
      </nav>
    </header>
  );
};

export default Header; 
