// Button.stories.js (or .mdx)

// import { fn } from '@storybook/test'; // Keep if you use it for action logging
import Button from './Button.jsx';

export default {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Props that directly control the Button's appearance/functionality
    layout: {
      control: {
        type: 'select',
        // Ensure these values directly map to what your class generation expects
        options: ['action', 'danger', 'primary', 'text-action', 'text-danger', 'text-primary'],
      },
      description: 'Which layout style the button should use for class generation.',
    },
    changeTag: {
      control: {
        type: 'select',
        options: ['button', 'span'], // These are the values your component expects
      },
      description: 'Change the HTML tag used to render the button (button or span).',
    },
    content: { // This is for the main visible text
      control: 'text',
      description: 'Button text content. Overrides children if provided.',
    },
    contentVisuallyHidden: {
      control: 'boolean',
      description: 'If true, the button content (text/children) will be visually hidden but accessible.',
    },
    buttonType: { // For the HTML type attribute of a <button>
      control: {
        type: 'select',
        options: ['button', 'submit', 'reset'],
      },
      description: "The HTML 'type' attribute for the button (if rendered as a button tag).",
      if: { arg: 'changeTag', eq: 'button' }, // Only show if changeTag is 'button'
    },
    children: { // Fallback or alternative for content
      control: 'text', // Or 'object' if you expect complex React nodes
      description: 'Children nodes, used as content if `content` prop is not provided.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names to apply to the button.',
    },
    style: {
      control: 'object',
      description: 'Inline CSS styles to apply to the button.',
    },
    name: {
      control: 'text',
      description: 'A name for the button, can be used for tracking or identification.',
    },
    // Props for react-aria's useButton (some common ones)
    // These will be passed to useButton via {...otherProps} or directly
    disabled: { // useButton uses `isDisabled` but often people pass `disabled`
      control: 'boolean',
      description: 'Disables the button.',
    },
    onPress: { action: 'pressed' }, // For react-aria, good for logging
    onClick: { action: 'clicked' }, // Standard HTML onClick, also good for logging
    // You might not need controls for all of these if they are not meant to be changed in Storybook often
    // For example, 'aria-label', 'aria-labelledby', etc.
  },
  args: { // Default args for all stories
    layout: 'action',
    changeTag: 'button',
    buttonType: 'button',
    content: 'Default Button Text',
    contentVisuallyHidden: false,
    disabled: false,
    className: '',
    // No default for style, name, context, children unless always needed
  },
};

// Example Stories
export const Primary = {
  args: {
    layout: 'primary',
    content: 'Primary Button',
  },
};

export const Action = {
  args: {
    layout: 'action',
    content: 'Action Button',
  },
};

export const DangerAsSpan = {
  args: {
    layout: 'danger',
    content: 'Danger Span',
    changeTag: 'span',
  },
};

export const VisuallyHiddenContent = {
  args: {
    layout: 'primary',
    content: 'Important Action (Hidden)',
    contentVisuallyHidden: true,
    // Add an aria-label if content is hidden, for accessibility
    'aria-label': 'Important Action', // This will be passed via ...otherProps to useButton
  },
};
