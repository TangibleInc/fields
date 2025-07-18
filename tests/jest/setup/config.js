import { setConfig } from '../../../assets/src/config.js'

setConfig({
  api: {
    nonce: '',  
    endpoint: {
      media: ''
    }  
  },
  fields: [],
  dynamics: {
    categories: {
      'test-category': {
        label: 'Test category',
        name: 'test-category',
        values: [
          'test-value-no-settings',
          'test-value-settings'
        ]
      },
      'test-category-2': {
        label: 'Test category 2',
        name: 'test-category-2',
        values: [
          'test-value-2-no-settings',
          'test-value-2-settings'
        ]
      }
    },
    values: {
      'test-value-no-settings': {
        category: 'test-category',
        name: 'test-value-no-settings',
        label: 'Test value no settings',
        type: 'text',
        description: 'Test value no settings description',
        fields: [],
      },
      'test-value-settings': {
        category: 'test-category',
        name: 'test-value-settings',
        label: 'Test value settings',
        type: 'text',
        description: 'Test value settings description',
        fields: [
          {
            type: 'text',
            name: 'dynamic-value-setting',
            label: 'Dynamic value setting',
          }
        ],
      },
      'test-value-2-no-settings': {
        category: 'test-category-2',
        name: 'test-value-2-no-settings',
        label: 'Test value 2 no settings',
        type: 'text',
        description: 'Test value 2 no settings description',
        fields: [],
      },
      'test-value-2-settings': {
        category: 'test-category-2',
        name: 'test-value-2-settings',
        label: 'Test value 2 settings',
        type: 'number',
        description: 'Test value settings description',
        fields: [
          {
            type: 'number',
            name: 'dynamic-value-setting',
            label: 'Dynamic value setting',
          }
        ],
      }
    }
  },
  mimetypes: {},
})
