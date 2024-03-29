import { evaluateCondition } from '.'

/**
 * Evaluates a conditional field
 */
const evaluateFieldVisibility = (fieldConditions, getValue) => {
  
  fieldConditions = typeof fieldConditions === 'object'
    ? replaceFieldValue(fieldConditions, getValue)
    : {}
  
  return evaluateCondition(fieldConditions)
}

/**
 * Replace field name by the current value so that we can evaluate conditions
 * 
 * @see ./index.js  
 */
const replaceFieldValue = (conditions, getValue) => {
  
  const formatedConditions = {}

  for( const name in conditions ) {

    if( ['_and', '_or'].includes(name) ) {
      formatedConditions[name] = conditions[name].map(
        field => replaceFieldValue(field, getValue)
      )
      continue;
    }

    let fieldValue = ''
    const isPartial = name.includes('.')
    if ( isPartial ) {
      const [fieldName, fieldAttribute] = name.split('.')
      fieldValue = getValue(fieldName)[fieldAttribute] ?? ''
    } else {
      fieldValue = getValue(name)
    }
    formatedConditions[fieldValue] = conditions[name]
  }

  return formatedConditions
}

/**
 * Get fields that will affect the visibility of the current conditions
 */
const getTriggerFields = conditions => {

  const fields = []

  for( const name in conditions ) {
    if( ['_and', '_or'].includes(name) ) {

      for( const part in conditions[name] ) {
        fields.push(
          getTriggerFields(conditions[name][part])
        )
      }
      continue;
    }

    fields.push(name)
  }

  return fields.flat().map(
    name => name.split('.')[0] // . is used when accessing value of an object
  )
}

export {
  evaluateFieldVisibility,
  getTriggerFields
}
