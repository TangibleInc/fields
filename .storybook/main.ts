import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../assets/src/components/**/*.mdx',
    '../assets/src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../assets/src/deprecated/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-docs',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  /**
   * TinyMce is served by WordPress from wp-includes, we serve the same
   * script from the npm package for the editor field stories
   */
  staticDirs: [
    { from: '../node_modules/tinymce', to: '/tinymce' },
    { from: './static/images', to: '/images' }
  ],
  typescript: {
    reactDocgen: false
  },
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true
  }
}

export default config
