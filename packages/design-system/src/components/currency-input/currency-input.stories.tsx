import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryFn } from "@storybook/react";

import { CurrencyInput, type CurrencyInputProps } from "./currency-input";

export default {
  title: "CurrencyInput",
  component: CurrencyInput,
  args: {
    value: 1234.56,
  },
  argTypes: {
    value: {
      control: {
        type: "number",
        min: 0,
        step: 0.01,
      },
      description: "Valor numérico em reais (R$).",
    },
    onBlur: {
      action: "blur",
      description: "Disparado ao perder o foco.",
      table: {
        category: "Events",
      },
    },
    onChange: {
      action: "change",
      description: "Disparado ao alterar o valor.",
      table: {
        category: "Events",
      },
    },
    onFocus: {
      action: "focus",
      description: "Disparado ao ganhar o foco.",
      table: {
        category: "Events",
      },
    },
    onKeyDown: {
      action: "keydown",
      description: "Disparado ao pressionar uma tecla.",
      table: {
        category: "Events",
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
    readOnly: {
      control: {
        type: "boolean",
      },
    },
  },
} satisfies Meta<typeof CurrencyInput>;

export const Default: StoryFn<typeof CurrencyInput> = (props: CurrencyInputProps) => {
  const [{ onChange, value }, updateArgs] = useArgs<CurrencyInputProps>();

  return (
    <div className="flex flex-col gap-2">
      <CurrencyInput
        {...props}
        value={value}
        onChange={(nextValue) => {
          updateArgs({ value: nextValue });
          onChange?.(nextValue);
        }}
      />
    </div>
  );
};
