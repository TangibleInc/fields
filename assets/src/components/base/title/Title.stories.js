import Title from './Title.jsx';

export default {
  title: 'Title',
  component: Title,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    level: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6],
      description: 'Heading level (h1–h6). Defaults to h3.',
    },
    content: {
      control: 'text',
      description: 'Text content for the heading. Overrides children.',
    },
    className: {
      control: 'text',
      description: 'Optional class name for the heading element.',
    },
  },
  args: {
    level: 3,
    content: 'Section Title',
  },
};

export const h1 = {
  args: {
    level: 1,
    content: 'Section Title',
  },
};
export const h2 = {
  args: {
    level: 2,
    content: 'Section Title',
  },
};