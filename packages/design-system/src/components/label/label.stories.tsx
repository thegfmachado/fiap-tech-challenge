import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { LabelProps } from './label.types';

export default {
  title: 'Label',
  component: Label,
  args: { children: 'Lorem ipsum dolor siamet' },
} satisfies Meta<typeof Label>;

export const Default: StoryObj<typeof Label> = {
  render: function Default(props: LabelProps) {
    return <Label {...props} />;
  },
};
