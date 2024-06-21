/**
 * Set up window.TangibleFields object as it would usually be created by wp_add_inline_script()
 * 
 * @see $fields->enqueue() in ../enqueue.php
 */
window.TangibleFields = {
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
      }
    }
  },
  mimetypes: {},
}

