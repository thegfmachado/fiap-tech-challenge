import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryFn } from "@storybook/react";
import type { ComponentProps } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./dialog";
import { Button } from "../button/button";

type DialogProps = ComponentProps<typeof Dialog>;

export default {
  title: "Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  args: {
    open: false,
    modal: true,
  } satisfies Pick<DialogProps, "open" | "modal">,
  argTypes: {
    open: {
      control: {
        type: "boolean",
      },
      description: "Controla o estado aberto/fechado do diálogo.",
    },
    modal: {
      control: {
        type: "boolean",
      },
      description: "Define se o diálogo é modal (bloqueia interação externa).",
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
} satisfies Meta<typeof Dialog>;

type Story = StoryFn<typeof Dialog>;

export const Default: Story = (props) => {
  const [{ open, modal, onOpenChange }, updateArgs] = useArgs<
    Pick<DialogProps, "open" | "modal" | "onOpenChange">
  >();

  const handleOpenChange = (nextOpen: boolean) => {
    updateArgs({ open: nextOpen });
    onOpenChange?.(nextOpen);
  };

  const isOpen = typeof open === "boolean" ? open : false;
  const isModal = typeof modal === "boolean" ? modal : true;

  return (
    <Dialog {...props} open={isOpen} modal={isModal} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Abrir diálogo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>Faça alterações em seu perfil abaixo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-sm text-muted-foreground">Nome</span>
            <input
              className="col-span-3 h-10 rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-sm text-muted-foreground">Usuário</span>
            <input
              className="col-span-3 h-10 rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              placeholder="@johndoe"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
