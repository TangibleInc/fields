import Dialog from './Dialog.jsx';

export default {
  title: 'Dialog',
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
    children: { 
      control: 'none', 
      description: 'Children nodes, used as content.',
    },
  },
  args: { 
    title: 'Dialog Title',
    children: `{ <div class="test">Hello world</div> }`,
  },
};

export const Primary = {
  args: {
    title: 'Dialog Title',
    children: <div className="test">Hello world</div>,
  },
};
