import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from './skeleton';

export default {
  title: 'Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export const Default: StoryObj<typeof Skeleton> = {
  render: function Default() {
    return (
      <div className="flex items-center space-x-4 bg-slate-300 p-4 rounded">
        <Skeleton className="h-12 w-12 rounded-full bg-slate-100" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-slate-100" />
          <Skeleton className="h-4 w-[200px] bg-slate-100" />
        </div>
      </div>
    );
  },
};
