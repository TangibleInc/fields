/**
 * Returns an object that can be used to map which exterio field will trigger which value
 * change inside the current control
 * 
 * Returned structure:
 * {
 *   'trigger-field-name': {
 *     'label': '',
 *     'attribute-name': '',
 *      // If value is not '', it means the props is an object and we are modifying on of its attribute
 *     'asyncValue': {
 *        'cutom-request-args': ''
 *      }
 *   },
 *  'trigger-field-name-2': {
 *      // ...
 *   },
 *   // ...
 * } 
 */
const getDependentFields = props => {

  const fields = {}

  for( const name in props ) {
    
    const value = props[name]

    if( typeof value === 'object' ) {
      
      const subfields = getDependentFields(value)
      const hasSubfields = Object.keys(subfields).length === 0

      if( hasSubfields ) continue;

      for( const triggerSubfield in subfields ) {
        if( ! fields[ triggerSubfield ] ) fields[ triggerSubfield ] = {}
        fields[ triggerSubfield ][ name ] = subfields[ triggerSubfield ]
      }
    }

    if( typeof value !== 'string' ) continue;

    const triggerField = getDynamicValue(value)
    if( ! triggerField ) continue;
    
    if( ! fields[ triggerField ] ) fields[ triggerField ] = {}
    fields[ triggerField ][ name ] = ''
  }
  
  return fields
}

const getDynamicValue = string => (
  string.startsWith('{{') && string.endsWith('}}')
    ? string.slice(2, string.length - 2).trim()
    : false
)

const mergeDependentProps = (
  props,
  dependentFields,
  getValue
) => {

  if( dependentFields === false ) return { ...props }

  const mergedProps = { ...props }

  for( const fieldName in dependentFields ) {

    const attributes = dependentFields[fieldName]

    for( const attributeName in attributes ) {
      
      const attribute = attributes[attributeName]

      /**
       * If value is not empty string it means it's a subfield
       * @see getDependentFields()
       */
      if( attribute !== '' ) {
        for( const subattributeName in attribute ) {
          /**
           * We need to create a new object, otherwise it causes issue in repeater and update
           * the props in every rows (even if mergedProps is already a clone of props) 
           */
          mergedProps[attributeName] = { 
            ...(mergedProps[attributeName]),
            [subattributeName]: getValue(fieldName)
          }
        }
        continue;
      }
      
      mergedProps[attributeName] = getValue(fieldName)
    }
  }

  return mergedProps
}

export {
  getDependentFields,
  getDynamicValue,
  mergeDependentProps
}
