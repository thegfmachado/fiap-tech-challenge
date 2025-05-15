"use client";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "components/ui/navigation-menu";

import { Button } from "@fiap-tech-challenge/design-system/components";

const cards = [
  {
    title: "Monitoramento de despesas em tempo real",
    content: "Monitore seus gastos de onde estiver.",
    image: "/images/landing/tracking.svg",
    icon: "/images/landing/eye.svg"
  },
  {
    title: "Planejamento de orçamento",
    content: "Crie e gerencie orçamentos com facilidade.",
    image: "/images/landing/budget.svg",
    icon: "/images/landing/coin.svg"
  },
  {
    title: "Insights financeiros",
    content: "Receba insights valiosos sobre suas finanças.",
    image: "/images/landing/insight.svg",
    icon: "/images/landing/presentation-chart.svg",
  },
  {
    title: "Dados seguros",
    content: "Seus dados financeiros estão seguros conosco.",
    image: "/images/landing/safe-data.svg",
    icon: "/images/landing/shield-tick.svg"
  },
]

export default function Page() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <header className="p-4 shadow-lg">
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

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                    Sobre
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                    Serviços
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                    Valores
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                    Contato
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Criar minha conta</Button>
            <Button>Entrar</Button>
          </div>
        </div>
      </header>

      <main className="mt-12">
        <section className="relative flex flex-col py-20 gap-20 items-center justify-center bg-gradient-to-b from-white via-white to-[#312C7233]">
          <h1 className="text-8xl text-center font-bold max-w-6xl">
            Tenha controle de suas finanças
          </h1>
          <Button>Comece agora</Button>

          <div className="hidden md:block mb-[300px]"></div>

          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-[460px] z-10">
            <Image
              src="/images/landing/hero.svg"
              alt="Floating"
              width={1024}
              height={720}
            />
          </div>

          <div className="md:hidden">
            <Image
              src="/images/landing/hero.svg"
              alt="Floating"
              width={0}
              height={0}
              sizes="100vw"
              className="rounded"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </section>

        <section className="p-8 flex flex-col gap-12">
          <div className="hidden md:block mb-[220px]"></div>

          <h2 className="text-3xl text-center font-bold">Por que escolher a FinTrack?</h2>

          <div className="grid grid-cols-1 md:grid-cols-[repeat(2,minmax(0,664px))] gap-6 justify-center">
            {cards.map((card, index) => (
              <Card key={index} className="w-full">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p>{card.content}</p>

                  <div className="self-center hidden md:block">
                    <Image
                      src={card.image}
                      width={464}
                      height={205}
                      alt={card.title}
                    />
                  </div>

                  <div className="self-center md:hidden">
                    <Image
                      src={card.icon}
                      width={116}
                      height={116}
                      alt={card.title}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
        </section>
      </main>

      <footer className="p-4 border-t border-t-secondary">
        <div className="flex justify-between gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              width={112}
              height={32}
              alt="Logo"
            />
          </Link>

          <NavigationMenu className="flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Sobre
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Serviços
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Valores
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Contato
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </footer>
    </div>
  )
}
