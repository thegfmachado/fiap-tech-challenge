import type { Preview } from '@storybook/react'
import * as React from 'react';

import { Root } from './root';

import '../src/styles/globals.css';

const preview: Preview = {
  decorators: [(Story) => <Root>{Story()}</Root>],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    layout: 'fullscreen',
    controls: {
      expanded: true,
    },
    backgrounds: { disable: true },
    options: {
      storySort: (storyA, storyB) => {
        return new Intl.Collator().compare(storyA, storyB);
      },
    },
  },
};

export default preview;