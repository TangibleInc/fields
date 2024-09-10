import '../../../../../assets/src/index.jsx'
import { 
  render,
  screen,
  within
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

const fields = window.tangibleFields

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
    'single',
    'multiple',
  ])('displays options when popover is open (%p)', async type => {

    const choices = {
      value1 : 'Value 1',
      value2 : 'Value 2',
      value3 : 'Value 3'
    }

    const user = userEvent.setup()
    const { container } = render(
      <>
        { fields.render({
          name     : 'field-name',
          type     : 'combo-box',
          label    : 'Label',
          choices  : choices,
          multiple : type === 'multiple'
        }) }    
        <span>Click me to unfocus</span>
      </>
    )

    for( const value in choices ) {
      expect(within(document).queryByText( choices[ value ] )).toBe(null)
    }

    await user.click( 
      type === 'multiple'
        ? within(container).getByText('Add')
        : within(container).getByText('▼') 
    )

    for( const value in choices ) {
      const item = within(document).getByText( choices[ value ] )
      expect(item.getAttribute('data-key')).toBe( value )
    }

    await user.click( within(container).getByText('Click me to unfocus') )

    for( const value in choices ) {
      expect(within(document).queryByText( choices[ value ] )).toBe(null)
    }
  })

  test.each([
    'single',
    'multiple',
  ])('displays options in async mode when popover is open (%p)', async type => {
    
    /**
     * Used to simulate async response
     */
    window.tangibleTests.fetchResponse = [
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

    window.tangibleTests.fetchResponse.forEach(
      result => {
        expect(within(document).queryByText( result.title )).toBe(null)
      }
    )

    await user.click( 
      type === 'multiple'
        ? within(container).getByText('Add')
        : within(container).getByText('▼') 
    )

    window.tangibleTests.fetchResponse.forEach(
      result => {
        const item = within(document).getByText( result.title )
        expect(item.getAttribute('data-key')).toBe( result.id )
      }
    )

    await user.click( within(container).getByText('Click me to unfocus') )

    window.tangibleTests.fetchResponse.forEach(
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
    window.tangibleTests.fetchResponse = []
    
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
    'single',
    'multiple',
  ])('supports readOnly (%p)', async type => {

    const choices = {
      value1 : 'Value 1',
      value2 : 'Value 2',
      value3 : 'Value 3'
    }

    const { container } = render(
      fields.render({
        name     : 'field-name',
        type     : 'combo-box',
        label    : 'Label',
        choices  : choices,
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
})
