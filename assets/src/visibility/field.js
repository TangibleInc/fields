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

    const fieldValue = getValue(name)
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

  return fields.flat()
}

export {
  evaluateFieldVisibility,
  getTriggerFields
}
