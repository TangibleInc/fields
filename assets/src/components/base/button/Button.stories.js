import { fn } from '@storybook/test';

import Button from './Button.jsx';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
};

export const Primary = {
  args: {
    layout: 'large',
    content: 'Primary Button',
    context: 'primary',
  },
};

export const Secondary = {
  args: {
    layout: 'large',
    content: 'Secondary Button',
    context: 'secondary',
  },
};
