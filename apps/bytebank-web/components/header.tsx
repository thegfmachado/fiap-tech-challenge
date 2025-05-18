import Image from 'next/image';
import Link from "next/link";

export function Header() {
  return (
    <header className="p-4 shadow-lg bg-white z-10">
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
