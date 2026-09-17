import {
  dynamicValueToString,
  stringToDynamicValue
} from './format'
import { getConfig } from '../index.tsx'

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
  const globalConfig = getConfig().dynamics
  return allowedTypes.includes(type)
    ? {
      getTypes      : () => config.types ?? defaultConfig[ type ].types,
      getMode       : () => getMode(type, config.mode ?? false),
      getCategories : () => config.categories ?? Object.keys(globalConfig.categories),
      getList       : () => globalConfig.values,
      getAll        : () => getDynamicStrings(value).map(stringToDynamicValue),
      getLabel      : type => globalConfig.values[type] ? globalConfig.values[type].label : type,
      stringify     : dynamicValueToString,
      parse         : stringToDynamicValue,
      hasValues     : () => getDynamicStrings(value).length !== 0,
      setValue      : value => setValue(value)
    }
    : false
}

/**
 * The same API for a consumer that has no host field — a page builder's
 * own dialog, a block editor's toolbar — so DynamicFieldSettings and the
 * grouped-choice helpers can be driven standalone. There is no value to
 * read or write, so the value-bound members are inert.
 *
 * `types` and `categories` default to everything the registry knows.
 */
const createDynamicValuesAPI = ({
  types,
  categories,
  mode = 'replace'
}: {
  types?: string[]
  categories?: string[]
  mode?: 'insert' | 'replace'
} = {}) => {
  const globalConfig = getConfig().dynamics ?? { values: {}, categories: {} }
  const allTypes = Array.from(
    new Set(
      Object.values(globalConfig.values ?? {}).map((value: any) => value?.type ?? 'text')
    )
  )
  return {
    getTypes      : () => types ?? allTypes,
    getMode       : () => mode,
    getCategories : () => categories ?? Object.keys(globalConfig.categories ?? {}),
    getList       : () => globalConfig.values ?? {},
    getAll        : () => [],
    getLabel      : (name: string) => globalConfig.values?.[name]?.label ?? name,
    stringify     : dynamicValueToString,
    parse         : stringToDynamicValue,
    hasValues     : () => false,
    setValue      : () => {}
  }
}

export {
  allowedTypes,
  defaultConfig,
  dynamicValuesAPI,
  createDynamicValuesAPI,
  getDynamicStrings,
  dynamicValueRegex
}
