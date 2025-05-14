/** @type { import('@storybook/react').Preview } */
import '../assets/build/default/index.min.css';
import '../assets/build/wp/index.min.css';
import '../assets/build/beaver-builder/index.min.css';
import '../assets/build/elementor/index.min.css';

const preview = {
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