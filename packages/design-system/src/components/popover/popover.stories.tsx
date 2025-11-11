import type { ComponentProps } from "react";
import type { Meta, StoryFn } from "@storybook/react";

import { useArgs } from "@storybook/preview-api";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "../button/button";
import { Input } from "../input/input";
import { Label } from "../label/label";

type PopoverProps = ComponentProps<typeof Popover>;

export default {
  title: "Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  args: {
    open: false,
    modal: false,
  } satisfies Pick<PopoverProps, "open" | "modal">,
  argTypes: {
    open: {
      control: {
        type: "boolean",
      },
      description: "Controla o estado aberto/fechado do popover.",
    },
    modal: {
      control: {
        type: "boolean",
      },
      description: "Determina se a interação fora do popover é bloqueada.",
    },
    onOpenChange: {
      action: "toggle",
      description: "Disparado quando o estado de abertura muda.",
      table: {
        category: "Events",
      },
    },
    defaultOpen: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Popover>;

type Story = StoryFn<typeof Popover>;

export const Default: Story = (props) => {
  const [{ open, modal, onOpenChange }, updateArgs] = useArgs<
    Pick<PopoverProps, "open" | "modal" | "onOpenChange">
  >();

  const handleOpenChange = (nextOpen: boolean) => {
    updateArgs({ open: nextOpen });
    onOpenChange?.(nextOpen);
  };

  const isOpen = typeof open === "boolean" ? open : false;
  const isModal = typeof modal === "boolean" ? modal : false;

  return (
    <Popover {...props} open={isOpen} modal={isModal} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline">Abrir popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-none">Detalhes do projeto</h3>
            <p className="text-sm text-muted-foreground">
              Preencha as informações básicas para compartilhar com sua equipe.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Projeto Bytebank" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              className="min-h-[80px] rounded-md border px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              placeholder="Resumo rápido do projeto"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

