import Number from './Number.jsx';

export default {
  title: 'Field/Number',
  component: Number,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the input',
    },
    description: {
      control: 'text',
      description: 'Helper text below the input',
    },
    value: {
      control: 'number',
      description: 'Current value',
    },
    readOnly: {
      control: 'boolean',
      description: 'Disable editing the number',
    },
    hasButtons: {
      control: 'boolean',
      description: 'Show increment/decrement buttons',
    },
  },
  args: {
    label: 'Quantity',
    description: 'Set a number',
    value: 2,
    readOnly: false,
    hasButtons: true,
  },
};

export const Default = (args) => <Number {...args} />;