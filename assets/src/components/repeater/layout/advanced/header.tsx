import * as tangibleFields from '../../../../index.tsx'

/**
 * This file contains helper functions that are used to render
 * a preview of the value, in the header of each items
 * 
 * By default, the header will display the value of all fields
 * 
 * This default behavior can be changed by passing the headerConfig 
 * prop, which will determine which fields are going to be displayed
 * 
 * For example, to only display the value of two field we set it to:
 * 
 * headerConfig={[
 *    'field-name-1',
 *    'field-name-2'
 * ]}
 * 
 * It is also possible to format the value before rendering it, by setting 
 * up a callback
 *  
 * For example, if I want to add a prefix to 'field-name-1':
 * 
 * headerConfig={[
 *    { name: 'field-name-1', callback: ({ value }) => `_Prefix_${value}` },
 *    'field-name-2'
 * ]}
 *
 * It is also possible register the callback separately. This can be useful when
 * the field is registered from the PHP side, as only the callback needs to be set
 * on the JS side
 * 
 * Example:
 * 
 * headerConfig={[
 *    { name: 'field-name-1', callback: 'callback_name` },
 *    'field-name-2'
 * ]}
 * 
 * // ...
 * 
 * tangibleFields.fields.repeater.registerCallback(
 *    'callback_name',
 *    ({ value }) => `_Prefix_${value}`
 * )
 * 
 * The logic is currently a bit tedious to read, and it would be nice to
 * reorganize/simplify it at some point
 */

const getHeaderFieldsName = (fields, config = false) => (
  config
    ? config.map(headerField => (
        typeof headerField === 'object'
          ? (headerField.name ?? false)
          : headerField
      ))
    : fields.map(field => field.name ?? '')
)

const getHeaderConfig = (fields, config = false) => {

  const headerFieldNames = getHeaderFieldsName(fields, config)
  const enableFields = fields.filter(
    field => (
         headerFieldNames.includes(field.name)
      || headerFieldNames.includes(field.name + '.label')
    ) 
  )

  return enableFields.map(
    headerField => formatConfig(headerField, config)
  )
}

const formatConfig = (currentField, config) => {

  const data = (
    config 
      ? config.find(field => (
          typeof field === 'object'
        && field.callback
        && field.name === currentField.name
      ))
    : false
  )

  return { 
    ...currentField,
    callback: data ? getCallback(data) : false
  }
}

const getCallback = data => {
  if ( typeof data.callback === 'function' ) return data.callback
  if ( typeof data.callback === 'string' ) {
    /**
     * If callback is a string, it means it's registered separatly
     * @see ./assets/src/fields.js
     */
    return tangibleFields
      .fields
      .repeater
      .__callbacks[ data.callback ] ?? false
  }
  return false
}

const renderHeaderValue = (column, item) => {

  if( ! item[ column.name ] || item[ column.name ] === '' ) {
    return <i>Empty</i>
  }

  if ( column.callback ) {
    return column.callback({
      column,
      value: item[ column.name ]
    })
  }

  /**
   * This special case was initially for async combobox values, that
   * uses a { value: '', label: '' } format
   * 
   * For more flexibility, we should probably add a way to display any
   * attribute when the value is an object
   */
  if ( typeof item[ column.name ] === 'object' ) {
    return item[ column.name ].label === '' 
      ? JSON.stringify(item[ column.name ]) // Fallback to avoid [object, Object], not ideal
      : item[ column.name ].label
  }

  return item[ column.name ]
}

export {
  getHeaderConfig,
  renderHeaderValue
}
