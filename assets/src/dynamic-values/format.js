const dynamicValueToString = (type, settings = false) => {

  if( settings === false ) return `[[${type}]]`;

  let settingsString = ''
  
  for( const key in settings ) {
    const value = settings[key]
    settingsString += `:${key}=${value}` 
  }

  return `[[${type}${settingsString}]]`
}

const stringToDynamicValue = string => {

  if( typeof string !== 'string' ) return false;
  
  const data = string
    .replace('[[', '')
    .replace(']]', '')
    .split(':')
  
  if( data.length === 0 ) return false

  return data.reduce(
    (response, string, i) => {
      
      if( i === 0 ) return response;
      
      const setting = string.split('=')
      
      return {
        ...response,
        settings: {
          ...response.settings,
          [setting[0]]: setting[1]
        }
      } 
    },
    {
      type: data[0],
      settings: {}
    }
  )
}

export {
  dynamicValueToString,
  stringToDynamicValue
}
