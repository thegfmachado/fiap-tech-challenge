"use client";

import { useState } from "react";
import { House, PanelLeft, X, ArrowRightLeft } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Skeleton,
} from "@fiap-tech-challenge/design-system/components";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";


import { HTTPService } from "@bytebank/client/services/http-service";
import { AuthService } from "@bytebank/client/services/auth-service";

import { useCurrentUser } from "@bytebank/hooks/use-current-user";

const httpService = new HTTPService();
const authService = new AuthService(httpService);

const navLinks = [
  { href: "/home", label: "Início", Icon: House },
  { href: "/transaction", label: "Transações", Icon: ArrowRightLeft },
];

interface NavLinksProps {
  pathname: string;
  onLinkClick?: () => void;
}

export function NavLinks(props: NavLinksProps) {
  const { pathname, onLinkClick } = props;

  return (
    <nav className="flex flex-col gap-6 p-4" aria-label="Menu principal">
      {navLinks.map(({ href, label, Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 capitalize ${isActive ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            onClick={onLinkClick}
          >
            <Icon className={isActive ? "text-primary" : "text-muted-foreground"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const { user, loading } = useCurrentUser();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authService.signOut();

      router.push("/");
    } catch (error) {
      console.error("Erro ao deslogar usuário:", error);
    }
  };

  return (
    <header className="p-4 shadow-lg bg-white z-20 md:fixed w-full md:col-span-2">
      <div className="flex justify-between items-center">
        <Link href="/" className="hidden sm:flex items-center gap-10">
          <Image src="/images/logo.svg" width={112} height={32} alt="Logo" />
        </Link>

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <button
              aria-label="Abrir menu"
              className="flex items-center gap-10 sm:hidden text-primary cursor-pointer"
              type="button"
            >
              <PanelLeft size={24} />
            </button>
          </DrawerTrigger>

          <DrawerContent>
            <DrawerHeader className="flex flex-row justify-between items-center">
              <DrawerTitle>Páginas</DrawerTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="text-muted-foreground" />
              </Button>
            </DrawerHeader>

            <nav className="flex flex-col gap-6 p-4" aria-label="Menu lateral">
              <NavLinks pathname={pathname} onLinkClick={() => setDrawerOpen(false)} />
            </nav>
          </DrawerContent>
        </Drawer>

        <Link href="/" className="flex items-center gap-10 sm:hidden">
          <Image
            src="/images/logo-small.svg"
            width={32}
            height={32}
            alt="Logo pequeno"
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button asChild variant="ghost">
              <div className="flex items-center gap-4">
                <Image src="/images/user.svg" width={24} height={24} alt="Imagem do usuário" />
                <span className="hidden sm:block">{loading ? <Skeleton className="h-4 w-24" /> : user?.user_metadata?.name}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleSignOut}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
