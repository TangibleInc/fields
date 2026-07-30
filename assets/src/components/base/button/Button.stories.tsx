import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from './Button'

const meta = {
  title: 'Base/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['primary', 'action', 'danger', 'text-action', 'text-primary', 'text-danger']
    },
    theme: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'destructive']
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'link']
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg']
    },
    iconSize: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg']
    },
    leftIconName: {
      control: 'text'
    },
    rightIconName: {
      control: 'text'
    },
    loading: {
      control: 'boolean'
    },
    fullWidth: {
      control: 'boolean'
    },
    testId: {
      control: 'text'
    },
    content: {
      control: 'text'
    }
  },
  args: {
    layout: 'action',
    content: 'Button',
    testId: 'base-button',
    size: 'md',
    iconSize: 'sm',
    loading: false,
    fullWidth: false
  }
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { layout: 'primary', content: 'Primary Button' }
}

export const Action: Story = {
  args: { layout: 'action', content: 'Action Button' }
}

export const Danger: Story = {
  args: { layout: 'danger', content: 'Danger Button' }
}

export const TextAction: Story = {
  args: { layout: 'text-action', content: 'Text Action' }
}

export const TextPrimary: Story = {
  args: { layout: 'text-primary', content: 'Text Primary' }
}

export const TextDanger: Story = {
  args: { layout: 'text-danger', content: 'Text Danger' }
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button layout="primary" content="Primary" />
      <Button layout="action" content="Action" />
      <Button layout="danger" content="Danger" />
      <Button layout="text-action" content="Text Action" />
      <Button layout="text-primary" content="Text Primary" />
      <Button layout="text-danger" content="Text Danger" />
    </div>
  )
}

export const WithIconsAndSize: Story = {
  args: {
    layout: 'primary',
    content: 'Save Changes',
    size: 'lg',
    leftIconName: 'system/check',
    rightIconName: 'system/chevron-right'
  }
}

export const OutlineMode: Story = {
  args: {
    layout: 'primary',
    variant: 'outline',
    content: 'Outline Button'
  }
}

export const LinkMode: Story = {
  args: {
    layout: 'action',
    variant: 'link',
    href: '#',
    content: 'Link Button'
  }
}

export const SpanTagTuiStyled: Story = {
  args: {
    layout: 'action',
    changeTag: 'span',
    content: 'Span Styled Like TUI Button'
  }
}
