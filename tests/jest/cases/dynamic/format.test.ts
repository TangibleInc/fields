import {
  allowedTypes,
  dynamicValuesAPI,
  defaultConfig
} from '../../../../assets/src/dynamic-values'
import { getConfig } from '../../../../assets/src/index.tsx'

describe('dynamic values feature - format', () => {

  test.each(allowedTypes)('%p type: uses default config when value of dynamic is true', type => {

    const expected = defaultConfig[ type ]
    const result = dynamicValuesAPI(
      '',
      value => {},
      {
        dynamic : true,
        type    : type
      }
    )

    expect(result.getTypes()).toStrictEqual(expected.types)
    expect(result.getMode()).toBe(expected.mode.default)
  })

  test.each(allowedTypes)('%p type: uses mode when only mode is set and supported, but still use default value for types', type => {

    const expected = defaultConfig[ type ]
    const oppositeMode = expected.mode.default === 'replace' ? 'insert' : 'replace'
    const oppositeModeSupported = expected.mode.supported.includes(oppositeMode)

    const result = dynamicValuesAPI(
      '',
      value => {},
      {
        dynamic : {
          mode : oppositeMode
        },
        type    : type
      }
    )

    expect(result.getTypes()).toStrictEqual(expected.types)
    expect(result.getMode()).toBe(oppositeModeSupported ? oppositeMode : expected.mode.default)
  })

  test.each(allowedTypes)('%p type: uses types when only types is set, but still use default value for mode', type => {

    const expected = defaultConfig[ type ]
    const customTypes = [ 'date', 'color' ]

    const result = dynamicValuesAPI(
      '',
      value => {},
      {
        dynamic : {
          types : customTypes
        },
        type    : type
      }
    )

    expect(result.getTypes()).toStrictEqual(customTypes)
    expect(result.getMode()).toBe(expected.mode.default)
  })

  it('uses all the categories by default', () => {

    const { dynamics } = getConfig()

    const allCategories = Object.keys(dynamics.categories)
    const result = dynamicValuesAPI(
      '',
      value => {},
      {
        dynamic : true,
        type    : 'text'
      }
    )

    expect(result.getCategories()).toStrictEqual(allCategories)
  })

  it('uses categories from the config when set', () => {

    const { dynamics } = getConfig()

    const allCategories = Object.keys(dynamics.categories)
    const result = dynamicValuesAPI(
      '',
      value => {},
      {
        dynamic : {
          categories : [ 'test-category' ]
        },
        type    : 'text'
      }
    )

    expect(result.getCategories()).toStrictEqual([ 'test-category' ])
  })

  it('return false when with a field type that does not support dynamic values', () => {

    const result = dynamicValuesAPI(
      '',
      value => {},
      {
        dynamic : true,
        type    : 'gradient'
      }
    )

    expect(result).toBe(false)
  })
})
