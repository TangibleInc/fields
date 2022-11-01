module.exports = {
  build: [
    {
      src: 'assets/src/index.jsx',
      dest: 'assets/build/index.min.js',
      react: 'wp'
    },{
      src: 'assets/src/index.scss',
      dest: 'assets/build/index.min.css'
    }
  ]
}
