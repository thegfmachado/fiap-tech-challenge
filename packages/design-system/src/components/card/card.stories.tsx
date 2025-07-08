import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter, CardAction } from './card';
import { Button } from '../button/button';

export default {
  title: 'Card',
  component: Card,
  args: {
    className: "w-full max-w-sm",
  }
} satisfies Meta<typeof Card>;

export const Default: StoryObj<typeof Card> = {
  render: function Default(props: React.ComponentProps<typeof Card>) {
    return (

      <Card {...props}>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 items-center">
          <p>Card Content</p>
        </CardContent>
        <CardFooter className="flex-col gap-2 items-start">
          <p>Card Footer</p>

          <CardAction className="w-full">
            <Button className="w-full">Card action</Button>
          </CardAction>
        </CardFooter>
      </Card>
    );
  },
};
