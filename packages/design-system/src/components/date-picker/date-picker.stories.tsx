import type { Meta, StoryObj } from "@storybook/react";

import { useArgs } from "@storybook/preview-api";

import { DatePicker, type DateRange, type DatePickerProps } from "./date-picker";

export default {
  title: "DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  args: {
    disabled: false,
    fitParent: false,
    readOnly: false,
  } satisfies Pick<DatePickerProps, "disabled" | "fitParent" | "readOnly">,
  argTypes: {
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
    fitParent: {
      control: {
        type: "boolean",
      },
      description: "Expande o botão para ocupar toda a largura do contêiner.",
    },
    mode: { control: false },
    onChange: {
      action: "change",
      description: "Disparado quando a data é atualizada.",
      table: {
        category: "Events",
      },
    },
    value: { control: false },
  },
} satisfies Meta<typeof DatePicker>;

export const Single: StoryObj<DatePickerProps> = {
  args: {
    mode: "single",
    value: new Date(),
  },
  argTypes: {
    value: {
      control: {
        type: "date",
      },
      description: "Data selecionada.",
    },
  },
  render: function Single(props: DatePickerProps) {
    const [{ value, onChange }, updateArgs] = useArgs();

    const handleChange = (nextValue: Date | undefined) => {
      updateArgs({ value: nextValue });
      onChange?.(nextValue);
    };

    return <DatePicker {...props} mode="single" value={value} onChange={handleChange} />;
  },
};

export const Range: StoryObj<DatePickerProps> = {
  args: {
    mode: "range",
    value: {
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  },
  argTypes: {
    value: {
      control: {
        type: "object",
      },
      description: "Intervalo de datas selecionado.",
    },
  },
  render: function Range(props: DatePickerProps) {
    const [{ value, onChange }, updateArgs] = useArgs();

    const handleChange = (nextValue: DateRange | undefined) => {
      updateArgs({ value: nextValue });
      onChange?.(nextValue);
    };

    return (
      <DatePicker
        {...props}
        mode="range"
        value={value}
        onChange={handleChange}
      />
    );
  },
};

