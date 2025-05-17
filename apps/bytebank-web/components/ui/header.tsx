import Image from 'next/image';
import Link from "next/link";

function Header() {
  return (
    <header className="p-4 border-b border-gray-200 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              width={112}
              height={32}
              alt="Logo"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Image
            src="/images/landing/user.svg"
            width={24}
            height={24}
            alt="user image"
          />
          <span>Ana Silva</span>
        </div>
      </div>
    </header>
  );
}

export default Header;