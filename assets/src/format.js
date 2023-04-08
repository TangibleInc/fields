const format = (value, defaultValue = '') => {

  if( isValidObject(value) ) return value

  const parsedValue = isValidJSON(value)

  return parsedValue !== false
    ? parsedValue
    : {
        value: (value ?? defaultValue), 
        dynamicValues: {

          /**
           * 3 possible values:
           * - false (no dynamic values used)
           * - 'insert' (1 dynamic value which replace the value)
           * - 'add' (multiple dynamic values inside the value has to be a string)
           */
          mode: false,  
          values: {}
        },
      }
}

const isValidObject = value => {

  const isObject = typeof value === 'object' && ! Array.isArray(value)

  if( ! isObject ) return false;

  if( ! value.hasOwnProperty('value') || ! value.hasOwnProperty('dynamicValues') ) {
    return false
  } 

  return value.dynamicValues.hasOwnProperty('mode') && value.dynamicValues.hasOwnProperty('values')
}

const isValidJSON = value => {
  try { 
    
    const parsed = JSON.parse(value)    
    
    return isValidObject(parsed)
      ? parsed
      : false
  } 
  catch(e) { return false }
}

export { format }
