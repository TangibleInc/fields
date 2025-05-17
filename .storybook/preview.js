/** @type { import('@storybook/react').Preview } */
import '../assets/build/default/index.min.css';
import '../assets/build/wp/index.min.css';
import '../assets/build/beaver-builder/index.min.css';
import '../assets/build/elementor/index.min.css';

import { withContext } from './decorators/context';

export const decorators = [withContext];


const preview = {
  globalTypes: {
    context: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Context',
        icon: 'paintbrush',
        // Array of plain string values or MenuItem shape (see below)
        items: ['default', 'wp', 'elementor', 'beaver-builder'],
        // Change title based on selected value
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'default',
  },
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;