// import { fn } from 'storybook/test'; // Keep if you use it for action logging
import ExpandablePanel from './ExpandablePanel.jsx';

export default {
  title: 'ExpandablePanel',
  component: ExpandablePanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Props that directly control the Button's appearance/functionality
    headerLeft: {
      control: 'text',
      description: 'Content to display before the ExpandablePanel title.',
    },
    title: {
      control: 'text',
      description: 'The ExpandablePanel title.',
    },
    headerRight: {
      control: 'text',
      description: 'Content to display after the ExpandablePanel title.',
    },
    isOpen: {
      control: 'boolean',
      description: 'Is the ExpandablePanel open?',
    },
    children: {
      control: 'object', 
      description: 'Children nodes, used as main content.',
    },
    footer: { 
      control: 'object', 
      description: 'Children nodes, used as footer content.',
    },
    behavior: {
      control: { type: 'inline-radio' },
      options: ['hide', undefined],
      description: 'Behavior',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names to apply to the ExpandablePanel.',
    },
  },
  args: { // Default args for all stories
    title: 'ExpandablePanel Title',
    children: 'Lorem ipsum dolor sit amet consectetur.',
    footer: 'Lorem ipsum',
    isOpen: false,
  },
};

// Example Stories
export const Primary = {
  args: {
    title: 'ExpandablePanel Title',
  },
};
