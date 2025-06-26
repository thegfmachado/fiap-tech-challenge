"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartColumn, ChartPie, Shield, TrendingUp } from "lucide-react";

import Image from "next/image";

import { redirect } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Button,
  FormLabel,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@fiap-tech-challenge/design-system/components";

const cards = [
  {
    title: "Controle total das suas finanças",
    icon: <ChartColumn color="white" size={20} />
  },
  {
    title: "Insights inteligentes",
    icon: <ChartPie color="white" size={20} />
  },
  {
    title: "Dados 100% seguros",
    icon: <Shield color="white" size={20} />
  },
  {
    title: "Alcance seus objetivos",
    icon: <TrendingUp color="white" size={20} />
  },
]

const loginFormSchema = z.object({
  email: z.string({ required_error: "Este campo é obrigatório" }).email("Email inválido"),
  password: z.string({ required_error: "Este campo é obrigatório" }).min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string({ required_error: "Este campo é obrigatório" }).min(6, "A senha deve ter pelo menos 6 caracteres")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export default function Page() {
  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleSubmit = (values: LoginFormSchemaType) => {
    console.log({
      values
    });

    redirect('/home');
  }

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <header className="p-4 shadow-lg bg-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-10">
            <a href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                width={112}
                height={32}
                alt="Logo"
              />
            </a>

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
        </div>
      </header>

      <main className="flex flex-col md:flex-row">
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

        <section className="p-5 md:p-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
          <Card className="w-full max-w-lg border-gray-50">
            <CardHeader>
              <CardTitle>Criar sua conta</CardTitle>
              <CardDescription>
                Crie sua conta para acessar o FinTrack
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="seu@email.com"
                          />

                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Digite sua senha"
                            showPasswordToggle
                          />

                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmação de senha</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirme sua senha"
                            showPasswordToggle
                          />

                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="w-full" size="lg" type="submit">
                    Enviar
                  </Button>

                  <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-2 p-4">
                    <p className="text-center text-muted-foreground">
                      Já tem uma conta?
                    </p>
                    <a className="text-primary font-medium" href="/auth/login">Entrar agora</a>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
