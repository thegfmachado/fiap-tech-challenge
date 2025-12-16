import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox, type CheckboxProps } from './checkbox';
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
} as Meta<typeof Checkbox>;

export const Default: StoryObj<CheckboxProps> = {
  render: function Default(props: CheckboxProps) {
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
          id="checkbox"
          onCheckedChange={handleCheckedChange}
        />
        <Label htmlFor="checkbox">Aceitar termos e condições</Label>
      </div>
    );
  },
};
