import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryFn } from "@storybook/react";
import type { ComponentProps } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { Button } from "../button/button";

type DrawerProps = ComponentProps<typeof Drawer>;

export default {
  title: "Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    open: false,
    direction: "bottom",
    modal: true,
  } satisfies Pick<DrawerProps, "open" | "direction" | "modal">,
  argTypes: {
    open: {
      control: {
        type: "boolean",
      },
      description: "Controla o estado aberto/fechado do drawer.",
    },
    direction: {
      control: {
        type: "select",
      },
      options: ["bottom", "top", "left", "right"],
      description: "Define de qual direção o drawer aparece.",
    },
    modal: {
      control: {
        type: "boolean",
      },
      description: "Define se o drawer bloqueia a interação fora dele.",
    },
    onOpenChange: {
      action: "toggle",
      description: "Disparado quando o estado de abertura muda.",
      table: {
        category: "Events",
      },
    },
    defaultOpen: { control: false },
    dismissible: { control: { type: "boolean" } },
    children: { control: false },
  },
} satisfies Meta<typeof Drawer>;

type Story = StoryFn<typeof Drawer>;

export const Default: Story = (props) => {
  const [{ open, modal, direction, onOpenChange }, updateArgs] = useArgs<
    Pick<DrawerProps, "open" | "modal" | "direction" | "onOpenChange">
  >();

  const handleOpenChange = (nextOpen: boolean) => {
    updateArgs({ open: nextOpen });
    onOpenChange?.(nextOpen);
  };

  const isOpen = typeof open === "boolean" ? open : false;
  const isModal = typeof modal === "boolean" ? modal : true;
  const currentDirection = direction ?? "bottom";

  return (
    <div className="h-[360px] w-full max-w-lg border bg-background">
      <Drawer
        {...props}
        open={isOpen}
        modal={isModal}
        direction={currentDirection}
        onOpenChange={handleOpenChange}
      >
        <div className="flex h-full items-center justify-center">
          <DrawerTrigger asChild>
            <Button>Abrir drawer</Button>
          </DrawerTrigger>
        </div>
        <DrawerContent className="p-4">
          <DrawerHeader>
            <DrawerTitle>Atualizar informações</DrawerTitle>
            <DrawerDescription>Faça alterações e salve quando estiver pronto.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-1 flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Nome</span>
              <input
                className="h-10 rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                placeholder="Nome completo"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">E-mail</span>
              <input
                className="h-10 rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                placeholder="email@exemplo.com"
                type="email"
              />
            </label>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
            <Button>Salvar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

Default.parameters = {
  layout: "centered",
};
