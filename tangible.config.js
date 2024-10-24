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
  archive: {
    root: 'tangible-fields',
    src: [
      '*.php',
      'assets/**',
      'dynamic-values/**',
      'elements/**',
      'example/**',
      'fields/**',
      'vendor/tangible/**',
      'readme.txt'
    ],
    dest: 'publish/tangible-fields.zip',
    exclude: [
      'assets/src',
      '**/tests',
      '**/*.scss',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx'
    ],
  },
  /**
   * Dependencies for production are installed in `vendor/tangible`, which is included
   * in the published zip package. Those for development are in `tangible-dev`, which
   * is excluded from the archive.
   * 
   * In the file `.wp-env.json`, these folders are mounted to the virtual file system
   * for local development and testing.
   */
  install: [
    {
      git: 'git@github.com:tangibleinc/framework',
      dest: 'vendor/tangible/framework',
      branch: 'main',
    },
    {
      git: 'git@github.com:tangibleinc/updater',
      dest: 'vendor/tangible/updater',
      branch: 'main',
    },
  ],
  installDev: [
    {
      zip: 'https://downloads.wordpress.org/plugin/beaver-builder-lite-version.latest-stable.zip',
      dest: 'vendor/tangible-dev/beaver-builder-lite-version'
    },
    {
      zip: 'https://downloads.wordpress.org/plugin/elementor.latest-stable.zip',
      dest: 'vendor/tangible-dev/elementor'
    },
  ] 
}
