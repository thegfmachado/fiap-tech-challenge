"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartColumn, ChartPie, Shield, TrendingUp } from "lucide-react";

import Link from "next/link";

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
  Checkbox,
  Skeleton,
  toast,
} from "@fiap-tech-challenge/design-system/components";

import { Header } from "@bytebank-web-auth/components/template/header";

import { HTTPService } from "@bytebank-web-auth/client/services/http-service";
import { AuthService } from "@bytebank-web-auth/client/services/auth-service";
import { WelcomeHero } from "@bytebank-web-auth/components/welcome-hero";

const httpService = new HTTPService();
const authService = new AuthService(httpService);

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
  rememberMe: z.boolean().optional(),
});

type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export default function Page() {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleSubmit = async (values: LoginFormSchemaType) => {
    setIsLoading(true);

    try {
      const user = await authService.signIn(values.email, values.password);

      if (user) {
        // next/navigation does not support redirects to external domains
        window.location.href = "/home";
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Erro ao fazer login. Verifique suas credenciais e tente novamente.");
      console.error("Erro ao fazer login:", error);
    }
  }

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <Header />

      <main className="flex flex-col md:flex-row">
        <WelcomeHero cards={cards} />

        <section className="p-5 md:p-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
          <Card className="w-full max-w-lg border-gray-50">
            <CardHeader>
              <CardTitle>Entrar na sua conta</CardTitle>
              <CardDescription>
                Digite seu email e senha para acessar o FinTrack
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {
                isLoading ? (
                  <div className="p-5 w-full max-w-lg grid gap-2">
                    <Skeleton className="h-9 w-full rounded-md mb-2" />
                    <Skeleton className="h-9 w-full rounded-md mb-2" />
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2 justify-between">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="w-30 h-5 rounded" />
                      </div>
                      <Skeleton className="w-50 h-4 rounded" />
                    </div>
                    <Skeleton className="w-full h-12 rounded-md mt-4" />
                  </div>
                ) : (
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

                      <div className="flex items-center justify-between py-2">
                        <FormField
                          control={form.control}
                          name="rememberMe"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  name={field.name}
                                  ref={field.ref}
                                />
                              </FormControl>
                              <FormLabel>Lembrar de mim</FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Link className="text-primary text-sm" href="/auth/forgot-password">Esqueci minha senha</Link>
                      </div>

                      <Button className="w-full" size="lg" type="submit">
                        Entrar
                      </Button>

                      <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-2 p-4">
                        <p className="text-center text-muted-foreground">
                          Ainda não tem uma conta?
                        </p>
                        <a className="text-primary font-medium" href="/auth/signup">Criar conta gratuita</a>
                      </div>
                    </form>
                  </Form>
                )
              }
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
