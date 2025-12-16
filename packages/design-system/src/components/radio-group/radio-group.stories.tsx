import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryFn } from "@storybook/react";
import type { ComponentProps } from "react";

import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "../label/label";

type RadioGroupProps = ComponentProps<typeof RadioGroup>;

export default {
  title: "RadioGroup",
  component: RadioGroup,
  args: {
    value: "light",
    disabled: false,
  } satisfies Pick<RadioGroupProps, "value" | "disabled">,
  argTypes: {
    value: {
      control: {
        type: "inline-radio",
      },
      options: ["light", "dark", "system"],
      description: "Valor atualmente selecionado.",
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
    onValueChange: {
      action: "change",
      description: "Disparado ao alterar a seleção.",
      table: {
        category: "Events",
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

type Story = StoryFn<typeof RadioGroup>;

export const Default: Story = (props) => {
  const [{ value, onValueChange }, updateArgs] = useArgs<
    Pick<RadioGroupProps, "value" | "onValueChange">
  >();

  const currentValue = typeof value === "string" ? value : "light";

  const handleValueChange = (nextValue: string) => {
    updateArgs({ value: nextValue });
    onValueChange?.(nextValue);
  };

  return (
    <RadioGroup
      className="max-w-sm"
      {...props}
      value={currentValue}
      onValueChange={handleValueChange}
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="light" id="light" />
        <Label htmlFor="light">Tema claro</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="dark" id="dark" />
        <Label htmlFor="dark">Tema escuro</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="system" id="system" />
        <Label htmlFor="system">Automático</Label>
      </div>
    </RadioGroup>
  );
};
