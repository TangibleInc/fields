import * as fields from '../../../../assets/src/index.jsx'
import { userEvent } from '@testing-library/user-event'
import { allowedTypes } from '../../../../assets/src/dynamic-values/index.js'
import {
  render,
  within
} from '@testing-library/react'

/**
 * TODO:
 * - More advanced tests to test value insertion / dynamic value setting from
 */

describe('dynamic values feature - render', () => {

  /**
   * Start by common test, field type specific tests are after
   *
   * We remove conditional panel because we won't render the dynamic
   * values directly in that case, but pass the config to child fields
   */
  const testTypes = allowedTypes.filter(type => type !== 'conditional-panel')

  test.each(testTypes)('%p type do not render dynamic values UI if not specified', type => {

    const { container } = render(
      fields.render({
        label : 'Label name',
        type  : type,
        name  : 'name'
      })
    )

    expect(within(container).queryByText('Insert')).toBeFalsy()
    expect(within(container).queryByText('Clear')).toBeFalsy()
  })

  test.each(testTypes)('%p type do not render dynamic values UI if dynamic is false', type => {

    const { container } = render(
      fields.render({
        label   : 'Label name',
        type    : type,
        name    : 'name',
        dynamic : false
      })
    )

    expect(within(container).queryByText('Insert')).toBeFalsy()
    expect(within(container).queryByText('Clear')).toBeFalsy()
  })

  test.each(testTypes)('%p type does render dynamic values UI if dynamic is true', type => {

    const { container } = render(
      fields.render({
        label   : 'Label name',
        type    : type,
        name    : 'name',
        dynamic : true
      })
    )

    expect(within(container).getByText('Insert')).toBeTruthy()

    // Special case for text, as it uses insert mode by default instead if replace like other types
    if( type === 'text' ) {
      expect(within(container).queryByText('Clear')).toBeFalsy()
    }
    else expect(within(container).getByText('Clear')).toBeTruthy()
  })

  test.each(testTypes)('%p type open dynamic value combobox when clicking on insert button', async type => {

    const user = userEvent.setup()
    const { container } = render(
      <>
        { fields.render({
          label   : 'Label name',
          type    : type,
          name    : 'name',
          dynamic : true
        }) }
        <div>Test click outside</div>
      </>
    )

    expect(document.querySelector('.tf-dynamic-wrapper-popover')).toBeFalsy()

    await user.click(within(container).getByText('Insert'))

    expect(document.querySelector('.tf-dynamic-wrapper-popover')).toBeTruthy()

    await user.click(within(container).getByText('Test click outside'))

    expect(document.querySelector('.tf-dynamic-wrapper-popover')).toBeFalsy()

    await user.click(within(container).getByText('Insert'))

    expect(document.querySelector('.tf-dynamic-wrapper-popover')).toBeTruthy()
  })

  test.each(testTypes)('%p type filters options by category', async type => {

    const choices = {
      'test-value-no-settings' : 'Test value no settings',
      'test-value-settings' : 'Test value settings',
    }
    const absentChoices = {
      'test-value-2-no-settings' : 'Test value 2 no settings',
      'test-value-2-settings' : 'Test value 2 settings'
    }
    const user = userEvent.setup()
    const { container } = render(
      <>
        { fields.render({
          label   : 'Label name',
          type    : type,
          name    : 'name',
          dynamic : {
            categories : [ 'test-category' ],
            types      : testTypes
          }
        }) }
        <div>Test click outside</div>
      </>
    )

    expect(document.querySelector('.tf-dynamic-wrapper-popover')).toBeFalsy()

    await user.click(document.querySelector('button.tf-dynamic-wrapper-insert'))

    expect(document.querySelector('.tf-dynamic-wrapper-popover')).toBeTruthy()

    Object.keys(choices).forEach( name => {
      const item = within(document).getByText( choices[ name ] )
      expect(item.getAttribute('data-key')).toBe( name )
    })

    Object.keys(absentChoices).forEach( name => {
      expect(within(document).queryByText( absentChoices[ name ] )).toBe(null)
    })

    await user.click(within(container).getByText('Test click outside'))

    Object.keys(choices).forEach( name => {
      expect(within(document).queryByText( choices[ name ] )).toBe(null)
    })
  })

  it('can filter dynamic options by type', async () => {

    let choices = {
      'test-value-2-settings' : 'Test value 2 settings',
    }
    const absentChoices = {
      'test-value-no-settings' : 'Test value no settings',
      'test-value-settings' : 'Test value settings',
      'test-value-2-no-settings' : 'Test value 2 no settings',
    }
    const user = userEvent.setup()
    const { container } = render(
      <>
        { fields.render({
          label   : 'Label name',
          type    : 'text',
          name    : 'name',
          dynamic : {
            types: [ 'number' ],
          }
        }) }
        <div>Test click outside</div>
      </>
    )

    expect(document.querySelector('.tf-dynamic-wrapper-popover')).toBeFalsy()

    await user.click(document.querySelector('button.tf-dynamic-wrapper-insert'))

    expect(document.querySelector('.tf-dynamic-wrapper-popover')).toBeTruthy()

    Object.keys(choices).forEach( name => {
      const item = within(document).getByText( choices[ name ] )
      expect(item.getAttribute('data-key')).toBe( name )
    })

    Object.keys(absentChoices).forEach( name => {
      expect(within(document).queryByText( absentChoices[ name ] )).toBe(null)
    })

    await user.click(within(container).getByText('Test click outside'))

    Object.keys(choices).forEach( name => {
      expect(within(document).queryByText( choices[ name ] )).toBe(null)
    })
  })

  it('does not crash if using dynamic on an unsupportede field type', () => {

    const { container } = render(
      fields.render({
        label   : 'Label name',
        type    : 'repeater',
        name    : 'name',
        dynamic : true
      })
    )

    expect(within(container).queryByText('Insert')).toBeFalsy()
    expect(within(container).queryByText('Clear')).toBeFalsy()
  })

  /**
   * Text field type tests
   */

  it('can use replace for text type', () => {

    const { container } = render(
      fields.render({
        label   : 'Label name',
        type    : 'text',
        name    : 'name',
        dynamic : {
          mode    : 'replace',
          types   : [ 'text' ]
        }
      })
    )

    expect(within(container).queryByText('Clear')).toBeFalsy()
    expect(within(container).getByText('Insert')).toBeTruthy()
  })

  it('can use remove when using replace mode for text type', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        label   : 'Label name',
        type    : 'text',
        value   : '[[test-value-no-settings]]',
        name    : 'name',
        dynamic : {
          mode    : 'replace',
          types   : [ 'text' ]
        }
      })
    )

    expect(within(container).queryByText('Insert')).toBeFalsy()
    expect(within(container).getByText('Clear')).toBeTruthy()

    await user.click(within(container).getByText('Clear'))

    expect(within(container).getByText('Insert')).toBeTruthy()
    expect(within(container).queryByText('Clear')).toBeFalsy()
  })

  it('can use insert for text type', () => {

    const { container } = render(
      fields.render({
        label   : 'Label name',
        type    : 'text',
        name    : 'name',
        dynamic : {
          mode    : 'insert',
          types   : [ 'text' ]
        }
      })
    )

    expect(within(container).getByText('Insert')).toBeTruthy()
    expect(within(container).queryByText('Clear')).toBeFalsy()
  })

})

/**
 * Helper to test dynamic value according to field type
 * Not use for now as I experienced issue with re-render in tests that I don't know how to fix
 *
 * @see ./setup/window.js
 */
const setValuesToFieldType = fieldType => {
  const type = getTypeByFieldType(fieldType)
  fields.dynamics.values[0].type = type
  fields.dynamics.values[1].type = type
}

const getTypeByFieldType = fieldType => {
  switch(fieldType) {
    case 'color-picker':
      return 'color'
    case 'date-picker':
      return 'date'
    case 'number':
      return 'number'
    case 'text':
      return 'text'
  }
}
