// Switch.stories.jsx
import Switch from './index.jsx'

export default {
  title: 'Field/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: {
      control: 'text',
      description: 'Switch description',
    },
    value: { 
      control: 'text', 
      description: 'Current value: should match valueOn or valueOff' 
    },
    valueOn: { control: 'text', defaultValue: 'on' },
    valueOff: { control: 'text', defaultValue: 'off' },
    onChange: { action: 'toggled' }
  },
  args: {
    label: 'Enable setting',
    value: 'off',
    valueOn: 'on',
    valueOff: 'off',
  },
}

export const Default = {}