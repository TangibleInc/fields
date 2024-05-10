/**
 * Returns an object that can be used to map which exterior field will trigger which value
 * change inside the current control
 * 
 * __returnedType is used to determine if we return the full value of the dependent field, or
 * just an attribute (in that case, __returnedAttribute needs to be defined as well)
 * 
 * __isWrapped indicate that we need to apply on (or multiple) dependent value inside an object of the 
 * field, on a specific attribute 
 * 
 * Example of returned structure:
 * {
 *   'trigger-field-name': {
 * 
 *      // Default return type, full value will be used
 *     'label'          : { __returnedType: 'full' },
 *     'attribute-name' : { __returnedType: 'full' },
 * 
 *      // Use an attribute of the dependent value instead of the full value
 *      'attribute-name' : { __returnedType: 'partial', __returnedAttribute: 'id' },
 *    
 *      // If dependent value is wrapped inside an object
 *     'asyncValue': {
 *         __isWrapped: true,
 *        'cutom-request-args': { __returnedType: 'full' }
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

    if( typeof value === 'object' && ! Array.isArray(value) ) {
      
      const subfields = getDependentFields(value)
      const hasSubfields = Object.keys(subfields).length === 0

      if( hasSubfields ) continue;

      for( const triggerSubfield in subfields ) {
        if( ! fields[ triggerSubfield ] ) fields[ triggerSubfield ] = {}
        fields[ triggerSubfield ][ name ] = {
          __isWrapped: true,
          ...subfields[ triggerSubfield ]
        }
      }
    }

    if( typeof value !== 'string' ) continue;

    const triggerField = getDependentValue(value)
    if( ! triggerField ) continue;

    if( ! fields[ triggerField.name ] ) fields[ triggerField.name ] = {}
    fields[ triggerField.name ][ name ] = triggerField.config
  }
  
  return fields
}

const isDependentString = string => string.startsWith('{{') && string.endsWith('}}')
const getDependentValue = string => {
  
  if( ! isDependentString(string) ) return false;

  const dependentString = string.slice(2, string.length - 2).trim()
  const isPartial = dependentString.includes('.')
  
  if( ! isPartial ) return {
    name   : dependentString,
    config : { __returnedType: 'full' }
  }
  
  /**
   * TODO: Improve so that we support nested attributes
   */
  const [name, attribute] = dependentString.split('.')
  return {
    name   : name,
    config : { 
      __returnedType: 'partial', 
      __returnedAttribute: attribute 
    }
  }
}

const getFieldValue = (config, getValue) => (
  config.__returnedType === 'partial'
    ? getValue()?.[ config.__returnedAttribute ]
    : getValue()
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
      
      const config = attributes[attributeName]

      /**
       * @see getDependentFields()
       */
      if( config.__isWrapped ) {
        for( const subattributeName in config ) {
          
          if( subattributeName === '__isWrapped' ) continue;

          const subattributeValue = getFieldValue(
            config[ subattributeName ], 
            () => getValue(fieldName)
          )

          /**
           * We need to create a new object, otherwise it causes issue in repeater and update
           * the props in every rows (even if mergedProps is already a clone of props) 
           */
          mergedProps[attributeName] = { 
            ...(mergedProps[attributeName]),
            [subattributeName]: subattributeValue
          }
        }
        continue;
      }
      
      mergedProps[attributeName] = getFieldValue(
        config,
        () => getValue(fieldName)
      )
    }
  }

  return mergedProps
}

export {
  getDependentFields,
  getDependentValue,
  mergeDependentProps,
  isDependentString
}
