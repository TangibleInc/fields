import Dialog from './Dialog.jsx'

export default {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The dialog title.',
    },
    titleLevel: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Heading level (1–6) used for the dialog title.',
    },
    titleId: {
      control: 'text',
      description: 'Custom ID for aria-labelledby. Auto-generated if omitted.',
    },
    useNative: {
      control: 'boolean',
      description: 'Render as native <dialog> element (for polyfilling or styling).',
    },
    children: { 
      control: 'text', 
      description: 'Dialog content.',
    },
  },
  args: { 
    title: 'Dialog Title',
    titleLevel: 4,
    useNative: false,
    children: 'Hello world',
  },
}

export const Default = {
  args: {
    title: 'Dialog Title',
    children: 'Hello world',
  },
}

export const NativeDialog = {
  args: {
    useNative: true,
    title: 'Native <dialog>',
    children: 'Rendered with the <dialog> element and open={true}',
  },
}

export const WithCustomTitleId = {
  args: {
    title: 'Custom ID Title',
    titleId: 'custom-dialog-title-id',
    children: 'This dialog uses a manually assigned aria-labelledby.',
  },
}