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
    categories: {},
    values: {}
  },
  mimetypes: {},
}

