import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { ButtonProps } from './button.types';
import { BUTTON_DEFAULT_PROPS } from './use-button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
    },
    onClick: { action: 'clicked' },
  },
  args: { ...BUTTON_DEFAULT_PROPS, children: 'Click me!', onClick: () => alert('Clicked') },
} satisfies Meta<typeof Button>;

export const Default: StoryObj<typeof Button> = {
  render: function Default(props: ButtonProps) {
    return <Button {...props} />;
  },
};
