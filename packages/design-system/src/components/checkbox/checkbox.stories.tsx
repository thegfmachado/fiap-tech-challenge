import * as React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from "storybook/internal/preview-api";

import { Checkbox } from './checkbox';
import { Label } from "../label/label";

export default {
  title: 'Checkbox',
  component: Checkbox,
  args: {
    checked: false,
  },
  argTypes: {
    onCheckedChange: {
      control: { type: 'boolean' },
      description: 'Function called when the checkbox state changes',
      action: 'checkedChange',
    }
  }
} satisfies Meta<typeof Checkbox>;

export const Default: StoryObj<typeof Checkbox> = {
  render: function Default(props) {
    const [{ checked }, updateArgs] = useArgs();

    const handleCheckedChange = (value: boolean) => {
      updateArgs({ checked: value });
      props.onCheckedChange?.(value);
    };

    return (
      <div className="flex items-center gap-3">
        <Checkbox
          {...props}
          checked={checked}
          onCheckedChange={handleCheckedChange}
        />
        <Label>Accept terms and conditions</Label>
      </div>
    );
  },
};
