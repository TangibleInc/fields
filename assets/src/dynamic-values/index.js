import {
  dynamicValueToString,
  stringToDynamicValue
} from './format'
import { getConfig } from '../index.jsx'

const { dynamics } = getConfig()

/**
 * Field type that support dynamic values (!== to supported props.dyanmic.types)
 */
const allowedTypes = [
  'color-picker',
  'conditional-panel',
  'date-picker',
  'number',
  'text'
]

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
 * Set up default config for each field type
 */
const defaultConfig = {
  'color-picker': {
    mode : {
      default   : 'replace',
      supported : [ 'replace' ]
    },
    types : [ 'color' ]
  },
  'conditional-panel': {
    mode : {
      default   : 'replace',
      supported : [ 'replace', 'insert' ],
      types : [
        'text',
        'date',
        'color',
        'number'
      ]
    },
    types : [ 'color' ]
  },
  'date-picker': {
    mode : {
      default   : 'replace',
      supported : [ 'replace' ]
    },
    types : [ 'date' ]
  },
  'number': {
    mode : {
      default   : 'replace',
      supported : [ 'replace' ]
    },
    types : [ 'number' ]
  },
  'text': {
    mode : {
      default   : 'insert',
      supported : [ 'insert', 'replace' ]
    },
    types : [
      'text',
      'date',
      'color',
      'number'
    ]
  }
}

/**
 * There are 2 possible mode, but both are not supported by all field types:
 * - Insert: Allow to mix regular text and multiple dynamic values in the same value
 * - Replace: Fully replace the field value with one dynampic value
 */
const getMode = (type, mode) => (
  defaultConfig[ type ].mode.supported.includes( mode )
    ? mode
    : defaultConfig[ type ].mode.default
)

/**
 * Helper to handle dynamic values in a Control component
 *
 * @see ../Control.jsx
 * @see ../components/dynamics/
 */
const dynamicValuesAPI = (value, setValue, {
  dynamic: config,
  type
}) => {
  return allowedTypes.includes(type)
    ? {
      getTypes      : () => config.types ?? defaultConfig[ type ].types,
      getMode       : () => getMode(type, config.mode ?? false),
      getCategories : () => config.categories ?? Object.keys(dynamics.categories),
      getList       : () => dynamics.values,
      getAll        : () => getDynamicStrings(value).map(stringToDynamicValue),
      getLabel      : type => dynamics.values[type] ? dynamics.values[type].label : type,
      stringify     : dynamicValueToString,
      parse         : stringToDynamicValue,
      hasValues     : () => getDynamicStrings(value).length !== 0,
      setValue      : value => setValue(value)
    }
    : false
}

export {
  allowedTypes,
  defaultConfig,
  dynamicValuesAPI,
  getDynamicStrings,
  dynamicValueRegex
}
