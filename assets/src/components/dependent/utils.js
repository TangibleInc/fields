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
 * __callback indicate the we need to apply a callback to format the dependent value before
 * using it
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
 *
 *      // Dependent attribute has a callback (type: string)
 *      'readOnly' : { __returnedType: 'full', __callback: 'callback-name' },
 *
 *      // Dependent attribute has a callback (type: function)
 *      'readOnly' : {
 *          __returnedType : 'full',
 *          __callback     : ({
 *              value,
 *              attribute
 *          }) => return 'something'
 *      },
 *   },
 *  'trigger-field-name-2': {
 *      // ...
 *   },
 *   // ...
 * }
 */
const getDependentFields = props => {

  const fields = {}

  /**
   * By default when prop.dependent is true, the value returned is going to be
   * the associated raw field value
   *
   * However, we can also set a custom callback to format this value before using it
   * as an attribute
   *
   * The callback can be defined either:
   * - as a function
   * - as a string, which is needed in case the field is registered in PHP. In that case
   *   we need to be able to register the callback separatly (@see tangibleFields.fields).
   */
  const callback = props.dependent?.callback ?? false

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

    const triggerField = getDependentValue(value, callback)
    if( ! triggerField ) continue;

    if( ! fields[ triggerField.name ] ) fields[ triggerField.name ] = {}
    fields[ triggerField.name ][ name ] = triggerField.config
  }

  return fields
}

const isDependentString = string => string.startsWith('{{') && string.endsWith('}}')
const getDependentValue = (string, callback) => {

  if( ! isDependentString(string) ) return false;

  const dependentString = string.slice(2, string.length - 2).trim()
  const isPartial = dependentString.includes('.')

  if( ! isPartial ) return {
    name   : dependentString,
    config : {
      __returnedType  : 'full',
      __callback      : callback
    }
  }

  /**
   * TODO: Improve so that we support nested attributes
   */
  const [name, attribute] = dependentString.split('.')
  return {
    name   : name,
    config : {
      __returnedType      : 'partial',
      __returnedAttribute : attribute,
      __callback          : callback
    }
  }
}

/**
 * Get raw field value, and apply callback (if any set)
 */
const getFieldValue = (attribute, config, getValue) => {

  const value = config.__returnedType === 'partial'
    ? getValue()?.[ config.__returnedAttribute ]
    : getValue()

  let callback = config.__callback ?? false

  /**
   * If typeof callback is string, it means that dependent callback has been
   * registered separatly from the field
   *
   * @see ./src/fields.php
   */
  if ( typeof callback === 'string' ) {
    const callbacks = tangibleFields.fields.dependent.__callbacks
    callback = callbacks[ callback ] ?? false
  }

  return callback
    ? callback({ attribute, value })
    : value
}

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
            subattributeName,
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
        attributeName,
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
