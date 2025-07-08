"use client";

import Image from "next/image";

import {
  Card,
  CardContent,
} from "@fiap-tech-challenge/design-system/components";

export type WelcomeHeroProps = {
  cards: {
    title: string;
    icon: React.ReactNode;
  }[];
};

export function WelcomeHero(props: WelcomeHeroProps) {
  const { cards } = props;

  return (
    <section className="p-5 md:p-10 border-r-1 border-gray-100 grow flex flex-col items-center justify-center bg-gradient-to-b from-[#DCD4E7] via-[#DCD4E7] to-white">
      <div className="p-5 space-y-5 md:p-10 md:space-y-10 flex flex-col items-center justify-center h-full max-w-xl">
        <Image
          className="hidden md:block"
          src="/images/logo.svg"
          width={216}
          height={60}
          alt="Logo"
        />

        <h1 className="text-4xl md:text-3xl lg:text-4xl text-center font-bold max-w-6xl">
          Bem vindo de volta!
        </h1>

        <h2 className="text-muted-foreground md:text-lg lg:text-xl text-center max-w-6xl">
          Continue sua jornada rumo à liberdade financeira.
          Seus dados estão seguros e prontos para você.
        </h2>
      </div>

      <div className="hidden md:flex flex-col gap-6 max-w-3xl">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex items-center justify-center p-4 bg-primary rounded">
                {card.icon}
              </div>
              <p className="text-center font-medium">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
