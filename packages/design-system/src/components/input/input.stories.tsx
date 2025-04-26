import * as React from "react";
import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './input';

export default {
  title: 'Input',
  component: Input,
  args: {
    className: "w-64",
    placeholder: "Placeholder",
    type: "text",
  },
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number"],
    },
    onChange: { action: 'onChange' },
  },
} satisfies Meta<typeof Input>;

export const Default: StoryObj<typeof Input> = {
  render: function Default(props: React.ComponentProps<"input">) {
    return (
      <Input {...props} />
    );
  },
};
