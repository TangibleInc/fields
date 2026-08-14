import * as fields from '../../../../../assets/src/index.tsx'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

/**
 * Test data for choices
 */
const getChoices = (category = false) => ({
  values : {
    value1 : 'Value 1',
    value2 : 'Value 2',
    value3 : 'Value 3'
  },
  categories : category
    ? [
        'Category 1',
        'Category 2'
      ]
    : false,
  config : category
    ? [
        {
          name    : 'Category 1',
          choices : {
            value1 : 'Value 1',
            value2 : 'Value 2',
          }
        },
        {
          name    : 'Category 2',
          choices : {
            value3 : 'Value 3'
          }
        }
      ]
    : {
        value1 : 'Value 1',
        value2 : 'Value 2',
        value3 : 'Value 3'
      }
})

const prefix = multiple => multiple ? 'tui-multicombobox' : 'tui-combobox'

/**
 * The options are always in the DOM, but they are only rendered inside the
 * popover when it is open
 */
const getPopover = multiple => document.querySelector(`.${prefix(multiple)}__content`)

const openPopover = (user, container, multiple) => user.click(
  container.querySelector(`.${prefix(multiple)}__input`)
)

const getChipLabels = container => (
  [ ...container.querySelectorAll('.tui-chip__text') ].map(chip => chip.textContent)
)

describe('ComboBox component', () => {

  /**
   * TODO:
   * - Test search (regular, multiple, async, async multiple)
   * - Test value change (regular, multiple, async, async multiple)
   * - Test key disabled (multiple)
   * - Test multiple selection (multiple, async multiple)
   * - Test map results (async, async multiple)
   */

  test.each([
    { type: 'single',   category: false },
    { type: 'single',   category: true },
    { type: 'multiple', category: false },
    { type: 'multiple', category: true },
  ])('displays label and description (%p)', async ({ type, category }) => {

    const choices = getChoices(category)

    const { container } = render(
      fields.render({
        name        : 'field-name',
        type        : 'combo-box',
        label       : 'I am the label',
        description : 'I am the description',
        choices     : choices.config,
        multiple    : type === 'multiple'
      })
    )

    const labels = within(container).getAllByLabelText('I am the label')
    const descriptions = within(container).getAllByText('I am the description')

    expect(labels.length).not.toBe(0)
    expect(descriptions.length).not.toBe(0)
  })

  test.each([
    { type: 'single',   category: false },
    { type: 'single',   category: true },
    { type: 'multiple', category: false },
    { type: 'multiple', category: true },
  ])('displays options when popover is open (%p)', async ({ type, category }) => {

    const choices = getChoices(category)
    const multiple = type === 'multiple'

    const user = userEvent.setup()
    const { container } = render(
      <>
        { fields.render({
          name     : 'field-name',
          type     : 'combo-box',
          label    : 'Label',
          choices  : choices.config,
          multiple : multiple
        }) }
        <span>Click me to unfocus</span>
      </>
    )

    expect(getPopover(multiple)).toBeFalsy()

    await openPopover(user, container, multiple)

    const popover = getPopover(multiple)

    for( const value in choices.values ) {
      expect(within(popover).getByText( choices.values[ value ] )).toBeTruthy()
    }

    if ( category ) {
      choices.categories.map(category => (
        expect(within(popover).getByText( category )).toBeTruthy()
      ))
    }

    await user.click( within(container).getByText('Click me to unfocus') )

    expect(getPopover(multiple)).toBeFalsy()
  })

  test.each([
    'single',
    'multiple',
  ])('displays options in async mode when popover is open (%p)', async type => {

    /**
     * Used to simulate async response
     */
    fields.config.fetchResponse = [
      { id: 'value1', title: 'Value 1' },
      { id: 'value2', title: 'Value 2' },
      { id: 'value3', title: 'Value 3' },
    ]

    const multiple = type === 'multiple'

    const user = userEvent.setup()
    const { container } = render(
      <>
        { fields.render({
          name      : 'field-name',
          type      : 'combo-box',
          label     : 'Label',
          isAsync   : true,
          searchUrl : 'https://search.com/endpoint',
          multiple  : multiple
        }) }
        <span>Click me to unfocus</span>
      </>
    )

    expect(getPopover(multiple)).toBeFalsy()

    await openPopover(user, container, multiple)

    for( const result of fields.config.fetchResponse ) {
      expect(await within(getPopover(multiple)).findByText( result.title )).toBeTruthy()
    }

    await user.click( within(container).getByText('Click me to unfocus') )

    expect(getPopover(multiple)).toBeFalsy()
  })

  test.each([
    'single',
    'multiple',
  ])('supports no results in async mode (%p)', async type => {

    /**
     * Used to simulate async response
     */
    fields.config.fetchResponse = []

    const multiple = type === 'multiple'

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'combo-box',
        label     : 'Label',
        isAsync   : true,
        searchUrl : 'https://search.com/endpoint',
        multiple  : multiple
      })
    )

    await openPopover(user, container, multiple)

    const item = await within(getPopover(multiple)).findByText('No results')
    const option = item.closest(`.${prefix(multiple)}__option`)

    expect(option.getAttribute('aria-disabled')).toBe('true')
  })

  test.each([
    { type: 'single',   category: false },
    { type: 'single',   category: true },
    { type: 'multiple', category: false },
    { type: 'multiple', category: true },
  ])('supports readOnly (%p)', async({ type, category }) => {

    const choices = getChoices(category)
    const multiple = type === 'multiple'

    const { container } = render(
      fields.render({
        name     : 'field-name',
        type     : 'combo-box',
        label    : 'Label',
        choices  : choices.config,
        multiple : multiple,
        value    : multiple ? 'value1,value3' : 'value1',
        readOnly : true
      })
    )

    const input = container.querySelector(`.${prefix(multiple)}__input`)

    expect(input.hasAttribute('disabled')).toBe(true)
    expect(container.querySelector('.tui-field').classList.contains('is-disabled')).toBe(true)

    /**
     * The clear button lets the value be changed, it is not rendered when the
     * field is read only, and the chips can't be removed
     */
    expect(container.querySelector(`.${prefix(multiple)}__clear`)).toBeFalsy()

    if ( multiple ) {
      const removeButtons = [ ...container.querySelectorAll('.tui-chip__remove') ]

      expect(removeButtons.length).toBe(2)
      removeButtons.forEach(button => expect(button.hasAttribute('disabled')).toBe(true))
    }
  })

  test.each([
    'single',
    'multiple',
  ])('if response is an object, convert it to an array in async mode (%p)', async type => {

    /**
     * Used to simulate async response
     */
    fields.config.fetchResponse = {
      0  : { id: 'value1', title: 'Value 1' },
      11 : { id: 'value2', title: 'Value 2' },
      28 : { id: 'value3', title: 'Value 3' },
    }

    const multiple = type === 'multiple'

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'combo-box',
        label     : 'Label',
        isAsync   : true,
        searchUrl : 'https://search.com/endpoint',
        multiple  : multiple
      })
    )

    await openPopover(user, container, multiple)

    for( const result of Object.values(fields.config.fetchResponse) ) {
      expect(await within(getPopover(multiple)).findByText( result.title )).toBeTruthy()
    }
  })

  test.each([
    { type: 'single',   category: false },
    { type: 'single',   category: true },
    { type: 'multiple', category: false },
    { type: 'multiple', category: true },
  ])('supports display of selected value (%p)', async({ type, category }) => {

    const choices = getChoices(category)
    const multiple = type === 'multiple'

    const { container } = render(
      fields.render({
        name     : 'field-name',
        type     : 'combo-box',
        label    : 'Label',
        choices  : choices.config,
        multiple : multiple,
        value    : 'value1'
      })
    )

    multiple
      ? expect(getChipLabels(container)).toEqual([ 'Value 1' ])
      : expect(screen.getByRole('combobox').value).toBe('Value 1')
  })

  test.each([
    { category: false },
    { category: true },
  ])('supports display of multiple values (%p)', async({ category }) => {

    const choices = getChoices(category)

    const { container } = render(
      fields.render({
        name     : 'field-name',
        type     : 'combo-box',
        label    : 'Label',
        choices  : choices.config,
        multiple : true,
        value    : 'value1,value3'
      })
    )

    expect(getChipLabels(container)).toEqual([ 'Value 1', 'Value 3' ])
  })

})
