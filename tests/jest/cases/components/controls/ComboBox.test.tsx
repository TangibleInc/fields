import * as fields from '../../../../../assets/src/index.tsx'
import { forwardRef } from 'react'
import {
    getAllByLabelText,
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
    
    const user = userEvent.setup()
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

    const user = userEvent.setup()
    const { container } = render(
      <>
        { fields.render({
          name     : 'field-name',
          type     : 'combo-box',
          label    : 'Label',
          choices  : choices.config,
          multiple : type === 'multiple'
        }) }
        <span>Click me to unfocus</span>
      </>
    )

    for( const value in choices.values ) {
      expect(within(document).queryByText( choices.values[ value ] )).toBe(null)
    }

    if ( category ) {
      choices.categories.map(category => (
        expect(within(document).queryByText( category )).toBe(null)
      ))
    }

    await user.click(
      type === 'multiple'
        ? within(container).getByText('Add')
        : within(container).getByText('▼')
    )

    for( const value in choices.values ) {
      const item = within(document).getByText( choices.values[ value ] )
      expect(item.getAttribute('data-key')).toBe( value )
    }

    if ( category ) {
      choices.categories.map(category => (
        expect(within(document).getByText( category )).toBeTruthy()
      ))
    }

    await user.click( within(container).getByText('Click me to unfocus') )

    for( const value in choices.values ) {
      expect(within(document).queryByText( choices.values[ value ] )).toBe(null)
    }

    if ( category ) {
      choices.categories.map(category => (
        expect(within(document).queryByText( category )).toBe(null)
      ))
    }
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

    const user = userEvent.setup()
    const { container } = render(
      <>
        { fields.render({
          name      : 'field-name',
          type      : 'combo-box',
          label     : 'Label',
          isAsync   : true,
          searchUrl : 'https://search.com/endpoint',
          multiple  : type === 'multiple'
        }) }
        <span>Click me to unfocus</span>
      </>
    )

    fields.config.fetchResponse.forEach(
      result => {
        expect(within(document).queryByText( result.title )).toBe(null)
      }
    )

    await user.click(
      type === 'multiple'
        ? within(container).getByText('Add')
        : within(container).getByText('▼')
    )

    fields.config.fetchResponse.forEach(
      result => {
        const item = within(document).getByText( result.title )
        expect(item.getAttribute('data-key')).toBe( result.id )
      }
    )

    await user.click( within(container).getByText('Click me to unfocus') )

    fields.config.fetchResponse.forEach(
      result => {
        expect(within(document).queryByText( result.title )).toBe(null)
      }
    )
  })

  test.each([
    'single',
    'multiple',
  ])('supports no results in async mode (%p)', async type => {

    /**
     * Used to simulate async response
     */
    fields.config.fetchResponse = []

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'combo-box',
        label     : 'Label',
        isAsync   : true,
        searchUrl : 'https://search.com/endpoint',
        multiple  : type === 'multiple'
      })
    )

    await user.click(
      type === 'multiple'
        ? within(container).getByText('Add')
        : within(container).getByText('▼')
    )

    const item = within(document).getByText('No results')

    expect(item.getAttribute('data-key')).toBe('_noResults')
    expect(item.getAttribute('aria-disabled')).toBe('true')
    expect(item.classList.contains('tf-list-box-option-disabled')).toBe(true)
  })

  test.each([
    { type: 'single',   category: false },
    { type: 'single',   category: true },
    { type: 'multiple', category: false },
    { type: 'multiple', category: true },
  ])('supports readOnly (%p)', async({ type, category }) => {

    const choices = getChoices(category)

    const { container } = render(
      fields.render({
        name     : 'field-name',
        type     : 'combo-box',
        label    : 'Label',
        choices  : choices.config,
        multiple : type === 'multiple',
        readOnly : true
      })
    )

    const button = type === 'multiple'
      ? within(container).getByText('Add')
      : within(container).getByText('▼').parentElement

    expect(button.hasAttribute('disabled')).toBe(true)

    if ( type === 'single' ) {
      const input = screen.getByRole('combobox')
      expect(input.hasAttribute('readonly')).toBe(true)
    }
    else {
      expect(within(container).queryByText('x')).toBeFalsy()
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

    const user = userEvent.setup()
    const { container } = render(
      <>
        { fields.render({
          name      : 'field-name',
          type      : 'combo-box',
          label     : 'Label',
          isAsync   : true,
          searchUrl : 'https://search.com/endpoint',
          multiple  : type === 'multiple'
        }) }
        <span>Click me to unfocus</span>
      </>
    )

    Object.values(fields.config.fetchResponse).forEach(
      result => {
        expect(within(document).queryByText( result.title )).toBe(null)
      }
    )

    await user.click(
      type === 'multiple'
        ? within(container).getByText('Add')
        : within(container).getByText('▼')
    )

    Object.values(fields.config.fetchResponse).forEach(
      result => {
        const item = within(document).getByText( result.title )
        expect(item.getAttribute('data-key')).toBe( result.id )
      }
    )
  })

  test.each([
    'single',
    'multiple'
  ])('support custom layouts (%p)', async type => {

    const CustomLayout = forwardRef((props, ref) => (
      <>
        <span>Custom search component</span>
        <input
          type="text"
          { ...props.inputProps }
          ref={ ref.current.input }
        />
        <ul>
          { [...props.state.collection].map(item => (
            <li key={ item.key }>
              { item.textValue }
            </li>
          )) }
        </ul>
      </>
    ))

    const choices = {
      value1 : 'Value 1',
      value2 : 'Value 2',
      value3 : 'Value 3'
    }

    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'combo-box',
        label     : 'Label',
        multiple  : type === 'multiple',
        choices   : choices,
        layout    : CustomLayout
      })
    )

    expect(within(container).getByText('Custom search component'))

    for( const value in choices ) {
      within(document).getByText( choices[ value ] )
    }
  })

  test.each([
    { type: 'single',   category: false },
    { type: 'single',   category: true },
    { type: 'multiple', category: false },
    { type: 'multiple', category: true },
  ])('supports display of selected value', async({ type, category }) => {

    const choices = getChoices(category)

    const { container } = render(
      fields.render({
        name     : 'field-name',
        type     : 'combo-box',
        label    : 'Label',
        choices  : choices.config,
        multiple : type === 'multiple',
        value    : 'value1'
      })
    )

    if ( type === 'multiple' ) {
      expect(within(container).getByText('Value 1')).toBeTruthy()
      expect(within(container).queryByText('Value 2')).toBeFalsy()
      expect(within(container).queryByText('Value 3')).toBeFalsy()
    }
    else {
      const input = screen.getByRole('combobox')
      expect(input.value).toBe('Value 1')
    }
  })

  test.each([
    { category: false },
    { category: true },
  ])('supports display of multiple values', async({ category }) => {

    const choices = getChoices(category)

    const { container } = render(
      fields.render({
        name     : 'field-name',
        type     : 'combo-box',
        label    : 'Label',
        choices  : choices.config,
        multiple : 'multiple',
        value    : 'value1,value3'
      })
    )

    expect(within(container).getByText('Value 1')).toBeTruthy()
    expect(within(container).queryByText('Value 2')).toBeFalsy()
    expect(within(container).getByText('Value 3')).toBeTruthy()
  })

})
