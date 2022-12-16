const uniqid = () => {
  const sec = Date.now() * 1000 + Math.random() * 1000
  return sec.toString(16).replace(/\./g, '').padEnd(14, '0')
}

const initJSON = (value, empty = false) => {

  if( Array.isArray(value) || typeof value === 'object' ) {
    return value;
  }

  if( value === '' && empty ) return empty;
  
  return JSON.parse(value)
}

/**
 * Convert object of choice to array of object  
 */
const getOptions = choices => (
  Object.keys(choices).map(key => ({ 
    value: key,
    label: choices[key],
  }))
)

export { 
  uniqid,
  getOptions,
  initJSON 
}
