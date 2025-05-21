"use client"

import { Home, ArrowLeftRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@fiap-tech-challenge/design-system/components";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    href: "/home",
    label: "Início",
    icon: Home
  },
  {
    href: "/transaction",
    label: "Transações",
    icon: ArrowLeftRight
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex grow max-w-[228px] shadow-lg flex-col bg-white z-10 h-full md:row-start-2 md:col-start-1">
      <nav className="flex-1 p-4">
        {sidebarItems.map(({ href, label, icon: Icon }) => (
          <Link href={href} key={href}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${pathname === href ? "text-primary" : "text-foreground"}`}
            >
              <span className="pl-5 flex items-center">
                <Icon className="mr-2 h-5 w-5" />
                {label}
              </span>
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
