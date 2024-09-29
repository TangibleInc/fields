import { visualizer } from 'rollup-plugin-visualizer'

export default {
  build: [

    /**
     * Script: Common for all contexts
     */
    {
      src: 'assets/src/index.jsx',
      dest: 'assets/build/index.min.js',
      react: 'wp',
      rollupPlugins: [
        visualizer({
          filename: '.rollup-plugin-visualizer.html',
        })
      ],
    },

    /**
     * Style: One stylesheet per context
     */
    {
      src: 'assets/src/contexts/default/index.scss',
      dest: 'assets/build/default/index.min.css'
    },
    {
      src: 'assets/src/contexts/wp/index.scss',
      dest: 'assets/build/wp/index.min.css'
    },
    {
      src: 'assets/src/contexts/elementor/index.scss',
      dest: 'assets/build/elementor/index.min.css'
    },
    {
      src: 'assets/src/contexts/beaver-builder/index.scss',
      dest: 'assets/build/beaver-builder/index.min.css'
    },

    /**
     * Example
     */
    {
      src: 'assets/src/example/index.js',
      dest: 'assets/build/example.min.js',
      react: 'wp',
    },
    {
      src: 'assets/src/example/index.scss',
      dest: 'assets/build/example.min.css',
    },
  ],
}
