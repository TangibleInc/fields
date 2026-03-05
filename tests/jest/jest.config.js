import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/cases'],
  setupFiles: [
    './setup/config.ts',
    './setup/range.ts',
    './setup/timeout.ts'
  ],
  // Explicitly point babel-jest at our config so it applies to node_modules too
  transform: {
    '\\.[jt]sx?$': ['babel-jest', {
      configFile: path.resolve(__dirname, 'babel.config.cjs')
    }]
  },
  // Transform ESM packages through Babel so Jest can require() them
  transformIgnorePatterns: [
    '<rootDir>/../../node_modules/(?!(@tangible/ui)/)'
  ],
  // Jest 29 doesn't fully support package.json "exports" — map to the actual entry file
  moduleNameMapper: {
    '^@tangible/ui$': '<rootDir>/../../node_modules/@tangible/ui/components/index.js'
  }
}
