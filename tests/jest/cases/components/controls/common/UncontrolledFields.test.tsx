import * as fields from '../../../../../../assets/src/index.tsx'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

/**
 * Accordion and Tab are wrapper of FieldGroups, they
 * should all support uncontrolled behavior
 */
const types = [ 'accordion', 'tab', 'field-group' ]

const buildArgs = (type, uncontrolled, value) => {

  const subField = { label : 'Subfield 1', type : 'switch', name : 'subfield1' }
  const args = {
    name         : `${ type }-name`,
    type,
    uncontrolled,
    value        : { subfield1 : value },
    fields       : [ uncontrolled ? { ...subField, value } : subField ]
  }

  if (type === 'accordion') args.isOpen = true

  /**
   * Tab nests its value JSON by tab key and uses a tabs map instead of fields
   */
  if (type === 'tab') {
    args.value = { 'tab-1' : args.value }
    args.tabs  = { 'tab-1' : { title : 'Title tab 1', fields : args.fields } }
    delete args.fields
  }

  return args
}

const extractSubValue = (type, json) =>
  type === 'tab' ? json['tab-1'].subfield1 : json.subfield1

describe(
  'Uncontrolled behavior for supported fields (FieldGroup, Accordion, Tab)',
  () => {

  test.each(types)('%p has hidden input and render sub-field values by default', async type => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render(
        buildArgs(type, false, 'off')
      )
    )

    const input = container.querySelectorAll(`input[name="${ type }-name"]`)
    expect(input.length).toBe(1)
    expect(
      extractSubValue(type, JSON.parse(input[0].value))
    ).toBe('off')

    await user.click(
      container.querySelector('.tf-switch-label')
    )

    expect(extractSubValue(type, JSON.parse(input[0].value))).toBe('on')
  })

  test.each(types)('%p does not render a hidden input when uncontrolled, sub-fields manage their own values', async type => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render(
        buildArgs(type, true, 'off')
      )
    )

    const parentInput = container.querySelectorAll(`input[name="${ type }-name"]`)
    expect(parentInput.length).toBe(0)

    const subInput = container.querySelector('input[name="subfield1"]')
    expect(subInput).toBeTruthy()
    expect(subInput.value).toBe('off')

    await user.click(
      container.querySelector('.tf-switch-label')
    )

    expect(subInput.value).toBe('on')
    expect(container.querySelectorAll(`input[name="${ type }-name"]`).length).toBe(0)
  })
})
