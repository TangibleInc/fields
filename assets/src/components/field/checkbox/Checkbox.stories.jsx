import Checkbox from './Checkbox.jsx'

export default {
  title: 'Field/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Checkbox label',
    },
    description: {
      control: 'text',
      description: 'Checkbox description',
    },
    value: {
      control: 'boolean',
      description: 'Checked state as boolean (true/false)',
    },
    onChange: {
      action: 'toggled',
      description: 'Fires when checkbox is toggled',
    },
  },
  args: {
    label: 'Subscribe to newsletter',
    value: false,
  },
}

export const Default = {}