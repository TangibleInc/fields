import { evaluateCondition } from '.'

/**
 * Evaluates a conditional field.
 */
const evaluateFieldVisibility = fieldConditions => {
  
  fieldConditions = typeof fieldConditions === 'object'
    ? replaceFieldValue(fieldConditions)
    : {}
  
  return evaluateCondition(fieldConditions)
}

/**
 * Replace field name by the current value so that we can evaluate conditions
 * 
 * @see ./index.js  
 */
const replaceFieldValue = fields => {
  
  const conditions = {}

  /**
   * Values is contains the value of every fields
   */
  const { values } = tangibleFields

  for( const name in fields ) {

    if( ['_and', '_or'].includes(name) ) {
      conditions[name] = fields[name].map(
        field => (replaceFieldValue(field))
      )
      continue;
    }

    // Field does not exist
    if( ! values[name] ) {
      conditions[name] = fields[name]
      continue;
    }

    const fieldValue = values[name]
    conditions[fieldValue] = fields[name]
  }

  return conditions
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
