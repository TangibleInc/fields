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
decorators: [
    (Story, { args }) => {
      const contextClass = args.context ? `tf-context-${args.context}` : '';
      
      return (
        <div className={contextClass}>
          {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
          <Story />
        </div>
      );
    },
  ],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
};

export const Primary = {
  args: {
    layout: 'primary',
    content: 'Primary Button',
    context: 'default',
  },
};

export const Secondary = {
  args: {
    layout: 'action',
    content: 'Action Button',
    context: 'default',
  },
};
