import {
  dynamicValueToString,
  stringToDynamicValue
} from './format'

const { dynamics } = TangibleFields

/**
 * Extract dynamic values token from a string like this one:
 * 
 * This is a text with a [[dynamic-value]]
 * 
 * @see ./dynamic-values/index.php 
 */
const dynamicValueRegex = /\[\[((?:(?!\]\]).)+\]?)\]\]/g
const getDynamicStrings = string => (
  typeof string === 'string'
    ? Array.from(
        string.matchAll(dynamicValueRegex), 
        match => match[1]
      )
    : []
)

/**
 * Helper to handle dynamic values in a Control component
 * 
 * @see ../Control.jsx 
 * @see ../components/dynamics/ 
 */
const dynamicValuesAPI = (value, setValue, fieldType, config) => ({
  // getTypes        : () => {
  //   if ( config.types ) return [ 'text', 'date', 'color', 'number' ].filter(value => config.types.includes(value))
  //   if ( [ 'date', 'color', 'number' ].includes(fieldType) ) return [ fieldType ]
  //   return [ 'text', 'date', 'color', 'number' ]
  // },
  // getMode         : () => {
  //   if ( config.mode ) return config.mode
  //   if ( [ 'date', 'color', 'number' ].includes(fieldType) ) return 'replace'
  //   return 'insert'
  // },
  // getCategories   : () => {
  //   if ( config.categories ) return Object.keys(dynamics.categories).filter(value => config.categories.includes(value))
  //   return Object.keys(dynamics.categories)
  // },
  getTypes        : () => config.types ?? [ 'text', 'date', 'color', 'number' ],
  getMode         : () => config.mode,
  getCategories   : () => config.categories ?? Object.keys(dynamics.categories),
  getList         : () => dynamics.values,
  getAll          : () => getDynamicStrings(value).map(stringToDynamicValue),
  getLabel        : type => dynamics.values[type] ? dynamics.values[type].label : type,
  stringify       : dynamicValueToString,
  parse           : stringToDynamicValue,
  hasValues       : () => getDynamicStrings(value).length !== 0,
  setValue        : value => setValue(value)
}) 

export { 
  dynamicValuesAPI,
  getDynamicStrings,
  dynamicValueRegex
}
