const format = value => {

  if( isValidObject(value) ) return value

  const parsedValue = isValidJSON(value)

  return parsedValue !== false
    ? parsedValue
    : {
        value: value,
        dynamicValues: {},
      }
}

const isValidObject = value => {

  const isObject = typeof value === 'object' && ! Array.isArray(value)

  if( ! isObject ) return false;

  return value.hasOwnProperty('value') && value.hasOwnProperty('dynamicValues')
    ? true
    : false
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
