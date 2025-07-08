"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartColumn, ChartPie, Loader2, Shield, TrendingUp } from "lucide-react";

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

import { HTTPService } from "@bytebank-web-auth/client/services/http-service";
import { AuthService } from "@bytebank-web-auth/client/services/auth-service";

import { createClient } from "@bytebank-web-auth/shared/utils/supabase/client";

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
  password: z.string({ required_error: "Este campo é obrigatório" }).min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string({ required_error: "Este campo é obrigatório" }).min(6, "A senha deve ter pelo menos 6 caracteres")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export default function Page() {
  const [isAuthLoading, setIsAuthLoading] = React.useState(true);
  const [isFormLoading, setIsFormLoading] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setIsAuthLoading(false);
      }
    })
  }, [])

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: LoginFormSchemaType) => {
    setIsFormLoading(true);

    try {
      await authService.updateUserPassword(values.password);

      form.reset();

      toast.success(`Senha atualizada com sucesso! Você será redirecionado para a página de login em 3 segundos.`, {
        duration: 3000,
        onAutoClose: () => {
          // next/navigation does not support redirects to external domains
          window.location.href = "/auth/login";
        }
      });
    } catch (error) {
      console.error("Erro ao atualizar senha do usuário.", error);
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <Header />

      <main className="flex flex-col md:flex-row">
        <WelcomeHero cards={cards} />

        <section className="p-5 md:p-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
          <Card className="w-full max-w-lg border-gray-50">
            <CardHeader>
              <CardTitle>Redefinir Senha</CardTitle>
              <CardDescription>
                Defina sua nova senha de acesso ao FinTrack
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {
                isAuthLoading ? (
                  <div className="flex items-center justify-center w-full h-20 gap-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Autenticando seu usuário</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {
                      isFormLoading ? (
                        <div className="p-5 w-full max-w-lg grid gap-2">
                          <Skeleton className="h-9 w-full rounded-md mb-2" />
                          <Skeleton className="h-9 w-full rounded-md mb-2" />
                          <Skeleton className="h-9 w-full rounded-md mb-2" />
                          <Skeleton className="h-9 w-full rounded-md mb-2" />
                          <Skeleton className="w-full h-12 rounded-md mt-4" />
                        </div>
                      ) : (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
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
                                Lembrou a senha?
                              </p>
                              <a className="text-primary font-medium" href="/auth/login">Voltar para login</a>
                            </div>
                          </form>
                        </Form>
                      )
                    }
                  </div>
                )
              }
            </CardContent>
          </Card>
        </section>
      </main>
    </div >
  )
}
