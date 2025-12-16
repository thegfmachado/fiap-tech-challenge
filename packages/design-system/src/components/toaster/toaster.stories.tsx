import type { Meta, StoryObj } from '@storybook/react';
import { toast, type ToasterProps } from "sonner";

import { Toaster } from './toaster';
import { Button } from '../button/button';

export default {
  title: 'Toaster',
  component: Toaster,
  args: {
    closeButton: false,
    duration: 4000,
    expand: false,
    gap: 16,
    invert: false,
    offset: 32,
    position: "bottom-right",
    richColors: false,
    visibleToasts: 3,
  },
  argTypes: {
    position: {
      control: { type: "select" },
      options: [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "top-center",
        "bottom-center",
      ],
    },
  }
} satisfies Meta<typeof Toaster>;

export const Default: StoryObj<typeof Toaster> = {
  render: function Default(props: ToasterProps) {
    return (
      <div>
        <Toaster {...props} />
        <Button
          variant="outline"
          onClick={() =>
            toast("Success", {
              description: new Date().toLocaleDateString(),
            })
          }
        >
          Show Toast
        </Button>
      </div>
    );
  },
};

export const WithAction: StoryObj<typeof Toaster> = {
  render: function WithAction(props: ToasterProps) {
    return (
      <div>
        <Toaster {...props} />
        <Button
          variant="outline"
          onClick={() =>
            toast("Success", {
              description: new Date().toLocaleDateString(),
              action: {
                label: "Undo",
                onClick: () => alert("Undone"),
              },
            })
          }
        >
          Show Toast
        </Button>
      </div>
    );
  },
}
