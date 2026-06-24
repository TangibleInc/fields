import * as fields from '../../../../../../assets/src/index.tsx'
import userEvent from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/react'

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

  /**
   * In uncontrolled mode the parent doesn't bundle sub-field values,
   * so each sub-field's own hidden input must stay in the DOM even
   * when the accordion is collapsed or the tab is inactive, otherwise
   * the form would lose data on submit
   */
  test.each([ 'accordion', 'tab' ])('%p keeps sub-fields mounted when collapsed / inactive in uncontrolled mode', async type => {

    const user = userEvent.setup()
    const args = buildArgs(type, true, 'off')

    if (type === 'accordion') args.isOpen = false
    if (type === 'tab') {
      args.tabs['tab-2'] = {
        title  : 'Title tab 2',
        fields : [
          { label : 'Subfield 2', type : 'switch', name : 'subfield2', value : 'off' }
        ]
      }
    }

    const { container } = render(
      fields.render(args)
    )

    if (type === 'accordion') {
      const subInput = container.querySelector('input[name="subfield1"]')
      expect(subInput).toBeTruthy()
      expect(subInput.value).toBe('off')
    }

    if (type === 'tab') {
      expect(container.querySelector('input[name="subfield1"]')).toBeTruthy()
      expect(container.querySelector('input[name="subfield2"]')).toBeTruthy()

      await user.click(container.querySelectorAll('.tf-tab-item button')[1])

      expect(container.querySelector('input[name="subfield1"]')).toBeTruthy()
      expect(container.querySelector('input[name="subfield2"]')).toBeTruthy()
    }
  })

  /**
   * In controlled mode the parent's bundled JSON holds everything,
   * so sub-fields can safely unmount when collapsed / inactive
   */
  test.each([ 'accordion', 'tab' ])('%p removes sub-fields from the DOM when collapsed / inactive in controlled mode', async type => {

    const user = userEvent.setup()
    const args = buildArgs(type, false, 'off')

    if (type === 'accordion') args.isOpen = false
    if (type === 'tab') {
      args.value['tab-2'] = { subfield2 : 'off' }
      args.tabs['tab-2'] = {
        title  : 'Title tab 2',
        fields : [
          { label : 'Subfield 2', type : 'switch', name : 'subfield2' }
        ]
      }
    }

    const { container } = render(
      fields.render(args)
    )

    if (type === 'accordion') {
      expect(container.querySelector('input[name="subfield1"]')).toBeFalsy()
    }

    if (type === 'tab') {
      expect(container.querySelector('input[name="subfield1"]')).toBeTruthy()
      expect(container.querySelector('input[name="subfield2"]')).toBeFalsy()

      await user.click(container.querySelectorAll('.tf-tab-item button')[1])

      expect(container.querySelector('input[name="subfield1"]')).toBeFalsy()
      expect(container.querySelector('input[name="subfield2"]')).toBeTruthy()
    }
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

  test.each(types)('%p support visibility conditions in uncontrolled mode', async type => {

    const user = userEvent.setup()
    const visibilityFields = [
      {
        label     : 'Subfield 1',
        type      : 'switch',
        name      : 'uncontrolled-subfield1',
        value     : 'on'
      },
      {
        label     : 'Subfield 2',
        type      : 'text',
        name      : 'uncontrolled-subfield2',
        condition : {
          action    : 'show',
          condition : { 'uncontrolled-subfield1' : { '_eq' : 'on' } }
        }
      }
    ]

    const args = {
      type,
      name         : 'uncontrolled-field-name',
      uncontrolled : true,
      fields       : visibilityFields
    }

    if (type === 'accordion') args.isOpen = true

    if (type === 'tab') {
      args.tabs = { 'tab-1' : { title : 'Title tab 1', fields : visibilityFields } }
      delete args.fields
    }

    const { container } = render(
      fields.render(args)
    )

    expect(container.querySelectorAll('.tf-text').length).toBe(1)

    await user.click(container.querySelector('.tf-switch-label'))

    await waitFor(() =>
      expect(container.querySelectorAll('.tf-text').length).toBe(0)
    )

    await user.click(container.querySelector('.tf-switch-label'))

    await waitFor(() =>
      expect(container.querySelectorAll('.tf-text').length).toBe(1)
    )
  })
})
