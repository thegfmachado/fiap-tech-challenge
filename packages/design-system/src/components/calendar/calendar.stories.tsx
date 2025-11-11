import type { Meta, StoryObj } from "@storybook/react";

import { useArgs } from "@storybook/preview-api";

import { Calendar, type CalendarProps } from "./calendar";

export default {
  title: "Calendar",
  component: Calendar,
  args: {
    disabled: false,
    mode: "single",
    selected: new Date(),
    showOutsideDays: true,
    numberOfMonths: 1,
  },
  argTypes: {
    mode: { control: false },
    selected: {
      control: {
        type: "date",
      },
      description: "Data selecionada quando em modo single.",
    },
    onSelect: {
      description: "Disparado ao selecionar uma data.",
      table: {
        category: "Events",
      },
    },
    showOutsideDays: {
      control: {
        type: "boolean",
      },
      description: "Exibe dias do mês anterior e posterior.",
    },
    numberOfMonths: {
      control: {
        type: "number",
      },
      description: "Quantidade de meses exibidos simultaneamente.",
    },
    disabled: {
      control: {
        type: "boolean",
      },
      description: "Desabilita o calendário.",
    },
  },
} as Meta<typeof Calendar>;

export const Default: StoryObj = {
  render: function Default(props: CalendarProps) {
    const [{ selected, onSelect }, updateArgs] = useArgs();

    const handleSelect = (date: Date | undefined) => {
      updateArgs({ selected: date });
      onSelect?.(date);
    };

    return (
      <div className="rounded-md border p-4">
        <Calendar
          {...props}
          mode="single"
          selected={selected}
          onSelect={handleSelect}
        />
      </div>
    );
  },
} as Meta<CalendarProps>;

