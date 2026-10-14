import type { StorybookConfig } from '@storybook/react-vite'

import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  stories: [
    /**
     * Feature documentation, which spans several components
     */
    '../docs/storybook/**/*.mdx',
    '../docs/storybook/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    /**
     * Component stories, next to the component they render
     */
    '../assets/src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../assets/src/deprecated/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-onboarding',
    /**
     * MDX doesn't support GFM (tables, strikethrough...) since MDX 2
     *
     * @see https://storybook.js.org/docs/writing-docs/mdx#markdown-tables-arent-rendering-correctly
     */
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm]
          }
        }
      }
    },
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
