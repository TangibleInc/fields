import type { Preview } from '@storybook/react-vite'

import './preview.css'
import '@tangible/ui/styles/unlayered'
import '../assets/src/contexts/default/index.scss'
import '../assets/src/contexts/wp/index.scss'
import '../assets/src/contexts/beaver-builder/index.scss'
import '../assets/src/contexts/elementor/index.scss'

import { withContext } from './decorators/context'

const preview: Preview = {
  decorators: [withContext],
  globalTypes: {
    context: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Context',
        icon: 'paintbrush',
        items: ['default', 'wp', 'elementor', 'beaver-builder'],
        dynamicTitle: true
      }
    },
    colorMode: {
      description: 'Global color mode',
      toolbar: {
        title: 'Mode',
        icon: 'circlehollow',
        items: ['light', 'dark', 'auto'],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: {
    context: 'default',
    colorMode: 'light'
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
