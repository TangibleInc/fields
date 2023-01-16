const uniqid = () => {
  const sec = Date.now() * 1000 + Math.random() * 1000
  return sec.toString(16).replace(/\./g, '').padEnd(14, '0')
}

const initJSON = (value, empty = false) => {

  if( Array.isArray(value) || typeof value === 'object' ) {
    return value;
  }

  if( value === '' && empty ) return empty

  try {
    return JSON.parse(value)
  } catch { 
    return {}
  }
}

/**
 * Create a Set from different types of values:
 * - JSON array
 * - Array
 * - String values separated by quotes
 */
const initSet = value => {
  
  if( value instanceof Set ) return value
  if( Array.isArray(value) ) return new Set(value)

  if( value.startsWith('[') && value.endsWith(']') ) {
    return initJSON(value, new Set())
  }

  return new Set( value.split(',') )
}

/**
 * Convert object of choice to array of object (can contain categories)
 */
const getOptions = choices => (
  Object.keys(choices).map(key => ( 
    choices[key].choices
    ? {
      ...choices[key], 
      key: choices[key].name,
      label: choices[key].name,
      choices: Object.keys(choices[key].choices).map(
        value => ({ 
          value: value,
          label: choices[key].choices[value],
        })
      ) 
    } : { 
      value: key,
      label: choices[key],
    }
  ))
)

/**
 * Return option by value
 */
const getOption =(value, options) => (
  options.filter(option => option.value === value)[0] ?? false
)

export { 
  uniqid,
  getOptions,
  getOption,
  initJSON,
  initSet
}
