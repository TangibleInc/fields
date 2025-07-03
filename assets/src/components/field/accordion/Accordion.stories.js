import Accordion from './Accordion';

export default {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Accordion Title',
    useSwitch: true,
    fields: [
      {
        name: 'description',
        label: 'Description',
        type: 'text',
      },
      {
        name: 'isVisible',
        label: 'Visible?',
        type: 'checkbox',
      },
    ],
    value: {
      enabled: 'on',
      description: 'Some text here',
      isVisible: true,
    },
    onChange: action('onChange'),
  },
};

export const Default = {};
