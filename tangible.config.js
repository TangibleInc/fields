module.exports = {
  build: [

    /**
     * Script: Common for all contexts
     */
    {
      src: 'assets/src/index.jsx',
      dest: 'assets/build/index.min.js',
      react: 'wp'
    },
    
    /**
     * Style: One stylesheet per context
     */
    {
      src: 'assets/src/contexts/default/index.scss',
      dest: 'assets/build/default/index.min.css'
    },{
      src: 'assets/src/contexts/wp/index.scss',
      dest: 'assets/build/wp/index.min.css'
    }
    
  ]
}
