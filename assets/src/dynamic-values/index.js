import {
  dynamicValueToString,
  stringToDynamicValue
} from './format'

const { dynamics } = TangibleFields

/**
 * Extract dynamic values token from a string like this one:
 * 
 * This is a text with a [[dynamic-value]] 
 */
const dynamicValueRegex = /\[\[([A-Za-zÀ-ú0-9_\- ]+(?!\[)[^\[\]]*)\]\]/g 
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
const dynamicValuesAPI = (value, setValue, types) => ({
  getTypes  : () => types,
  getList   : () => dynamics,
  getAll    : () => getDynamicStrings(value).map(stringToDynamicValue),
  getLabel  : type => dynamics[type] ? dynamics[type].label : type,
  stringify : dynamicValueToString,
  parse     : stringToDynamicValue,
  hasValues : () => getDynamicStrings(value).length !== 0,
  setValue  : value => setValue(value) 
}) 

export { 
  dynamicValuesAPI,
  getDynamicStrings,
  dynamicValueRegex
}
