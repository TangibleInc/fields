/**
 * Default configuration with all expected properties
 */
export const config = {
  api: {
    nonce: '',
    endpoint: {
      media: ''
    }  
  },
  fields: [],
  elements: [],
  dynamics: {
    categories: {},
    values: {}
  },
  mimetypes: {},
  fetchResponse: undefined, // Use to mock fetch response in tests
}

export function getConfig() {
  return config
}

export function setConfig(newConfig) {
  return Object.assign(config, newConfig)
}
