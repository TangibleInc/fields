// Won't work as an ES6 modules and won't work if named .js instead of .cjs
module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', {runtime: 'automatic'}],
    ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
  ],
  plugins: [
    './babel-plugin-import-meta-env.cjs',
  ],
}
