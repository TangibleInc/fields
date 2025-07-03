import Notice from './Notice.jsx';

export default {
  title: 'Notice',
  component: Notice,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'The Notice content.',
    },
    type: {
      control:  'select',
      options: ['tf-error', 'tf-success', 'tf-warning', 'tf-info'],
      description: 'Which layout style the button should use for class generation.',
    },
    onDismiss: { action: 'pressed' },
  },
  args: { 
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu ligula bibendum, tincidunt elit eget, bibendum lorem. Aliquam erat volutpat. Fusce eu bibendum urna.',
  },
};

export const Info = {
  args: {
    type: 'tf-info',
  },
};

export const Warning = {
  args: {
    type: 'tf-warning',
  },
};

export const Success = {
  args: {
    type: 'tf-success',
  },
};

export const Error = {
  args: {
    type: 'tf-error',
  },
};