import type { Preview } from '@storybook/react-vite'

import './preview.css'
import '@tangible/ui/styles/unlayered'
import '../assets/src/contexts/default/index.scss'
import '../assets/src/contexts/wp/index.scss'
import '../assets/src/contexts/beaver-builder/index.scss'
import '../assets/src/contexts/elementor/index.scss'

import { withContext } from './decorators/context'
import { withGlobalCss } from './decorators/globalCss'
import { withRtl } from './decorators/rtl'

const preview: Preview = {
  decorators: [withGlobalCss, withRtl, withContext],
  globalTypes: {
    direction: {
      description: 'Global text direction',
      toolbar: {
        title: 'Direction',
        icon: 'globe',
        items: ['ltr', 'rtl'],
        dynamicTitle: true
      }
    },
    css: {
      description: 'Global CSS environment simulation',
      toolbar: {
        title: 'Global CSS',
        icon: 'document',
        items: ['auto', 'none', 'basic', 'wordpress', 'elementor', 'beaver-builder'],
        dynamicTitle: true
      }
    },
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
    direction: 'ltr',
    css: 'auto',
    context: 'default',
    colorMode: 'light'
  },
  parameters: {
    controls: {
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      controls: {
        sort: 'requiredFirst'
      }
    }
  }
}

export default preview
