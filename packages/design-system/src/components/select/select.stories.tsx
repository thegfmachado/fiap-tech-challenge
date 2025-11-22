import type { ComponentProps } from "react";
import type { Meta, StoryFn } from "@storybook/react";

import { useArgs } from "@storybook/preview-api";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

type SelectProps = ComponentProps<typeof Select>;

export default {
  title: "Select",
  component: Select,
  args: {
    value: "monthly",
    open: false,
    disabled: false,
  } satisfies Pick<SelectProps, "value" | "open" | "disabled">,
  argTypes: {
    value: {
      control: {
        type: "inline-radio",
      },
      options: ["monthly", "semester", "annual", "business-basic", "business-plus", "enterprise"],
      description: "Valor selecionado atualmente.",
    },
    open: {
      control: {
        type: "boolean",
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
    onValueChange: {
      action: "change",
      description: "Disparado quando uma nova opção é escolhida.",
      table: {
        category: "Events",
      },
    },
    onOpenChange: {
      action: "toggle",
      description: "Disparado ao abrir ou fechar o select.",
      table: {
        category: "Events",
      },
    },
  },
} satisfies Meta<typeof Select>;

type Story = StoryFn<typeof Select>;

export const Default: Story = (props) => {
  const [{ value, open, onValueChange, onOpenChange }, updateArgs] = useArgs();

  const handleValueChange = (nextValue: string) => {
    updateArgs({ value: nextValue });
    onValueChange?.(nextValue);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    updateArgs({ open: nextOpen });
    onOpenChange?.(nextOpen);
  };

  return (
    <Select
      {...props}
      value={value}
      open={open}
      onValueChange={handleValueChange}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Selecione um plano" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Planos</SelectLabel>
          <SelectItem value="monthly">Mensal</SelectItem>
          <SelectItem value="semester">Semestral</SelectItem>
          <SelectItem value="annual">Anual</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Empresarial</SelectLabel>
          <SelectItem value="business-basic">Business Básico</SelectItem>
          <SelectItem value="business-plus">Business Plus</SelectItem>
          <SelectItem value="enterprise" disabled>
            Enterprise (em breve)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

