"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartColumn, ChartPie, Shield, TrendingUp } from "lucide-react";

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
  Skeleton,
  toast,
} from "@fiap-tech-challenge/design-system/components";

import { Header } from "@bytebank-web-auth/components/template/header";
import { WelcomeHero } from "@bytebank-web-auth/components/welcome-hero";

import { HTTPService } from "@fiap-tech-challenge/services/http";
import { AuthService } from "@bytebank-web-auth/client/services/auth-service";

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
});

type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export default function Page() {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: LoginFormSchemaType) => {
    setIsLoading(true);

    await authService.forgotPassword(values.email);

    setIsLoading(false);

    toast.success(`Caso uma conta exista para este endereço de e-mail, você receberá instruções para continuar. Verifique sua caixa de entrada (e de spam também).`, {
      duration: 6000,
    });
  }

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <Header />

      <main className="flex flex-col md:flex-row">
        <WelcomeHero cards={cards} />

        <section className="p-5 md:p-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
          <Card className="w-full max-w-lg border-gray-50">
            <CardHeader>
              <CardTitle>Solicitação de Redefinir Senha</CardTitle>
              <CardDescription>
                Digite seu email e para prosseguir com a redefinição da senha de acesso ao FinTrack
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {
                isLoading ? (
                  <div className="p-5 w-full max-w-lg grid gap-2">
                    <Skeleton className="h-9 w-full rounded-md mb-2" />
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

                      <Button className="w-full" size="lg" type="submit">
                        Enviar
                      </Button>

                      <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-2 p-4">
                        <p className="text-center text-muted-foreground">
                          Lembrou a senha?
                        </p>
                        <a className="text-primary font-medium" href="/auth/login">Voltar para login</a>
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
