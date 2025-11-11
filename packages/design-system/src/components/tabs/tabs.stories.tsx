import type { Meta, StoryObj } from "@storybook/react";

import { useArgs } from "@storybook/preview-api";

import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsProps } from "./tabs";

export default {
  title: "Tabs",
  component: Tabs,
  args: {
    value: "account",
  },
  argTypes: {
    value: {
      control: {
        type: "inline-radio",
      },
      options: ["account", "security", "notifications"],
      description: "A aba atualmente ativa.",
    },
    onValueChange: {
      action: "change",
      description: "Disparado quando o valor ativo muda.",
      table: {
        category: "Events",
      },
    },
  },
} as Meta<typeof Tabs>;

export const Default: StoryObj<TabsProps> = {
  render: function Default(props: TabsProps) {
    const [{ value, onValueChange }, updateArgs] = useArgs();

    const handleValueChange = (nextValue: string) => {
      updateArgs({ value: nextValue });
      onValueChange?.(nextValue);
    };

    return (
      <Tabs
        className="max-w-xl"
        {...props}
        value={value}
        onValueChange={handleValueChange}
      >
        <TabsList>
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="rounded-md border p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-none">Informações da conta</h3>
            <p className="text-sm text-muted-foreground">
              Atualize seu nome, e-mail e outras informações básicas da conta.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="security" className="rounded-md border p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-none">Segurança</h3>
            <p className="text-sm text-muted-foreground">
              Configure autenticação em duas etapas e revise dispositivos conectados.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="rounded-md border p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-none">Notificações</h3>
            <p className="text-sm text-muted-foreground">
              Escolha como deseja ser notificado sobre movimentações e alertas.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    );
  },
};

