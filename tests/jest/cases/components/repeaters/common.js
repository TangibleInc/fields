import '@testing-library/jest-dom'
import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const fields = window.tangibleFields

/**
 * Run common tests that must succeed for all repeater types
 * 
 * TODO: 
 * - Tests with initial value
 * - Test clone button (check key is different)
 */
const commonRepeaterTests = layout => {

  const cloneText = layout !== 'advanced' ? 'Clone' : 'Duplicate'
  const removeText = layout !== 'advanced' ? 'Remove' : 'Delete'

  it('contains the wrapper classes', () => {

    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : layout,
        fields : []
      })
    )

    const classes = container.firstChild.firstChild.classList

    expect(classes.contains(`tf-repeater`)).toEqual(true)
    expect(classes.contains(`tf-repeater-${layout}`)).toEqual(true)
  })

  it('renders one subfield on inital render if no value passed', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : layout,
        fields : [
          { 
            type  : 'text',
            label : 'Label text',
            name  : 'text-field'
          },
          { 
            type  : 'number',
            label : 'Label number',
            name  : 'number-field'
          }
        ]
      })
    )

    // Needs to open panel to see fields
    if( layout === 'advanced' ) {
      await user.click(container.querySelector('.tf-button-repeater-overview-open'))
    }
    
    expect(document.getElementsByClassName('tf-text').length).toBe(1)
    expect(document.getElementsByClassName('tf-number').length).toBe(1)
  })

  it('renders no subfield on inital render if value is an empty array', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : layout,
        value  : '[]',
        fields : [
          { 
            type  : 'text',
            label : 'Label text',
            name  : 'text-field'
          },
          { 
            type  : 'number',
            label : 'Label number',
            name  : 'number-field'
          }
        ]
      })
    )

    // Needs to open panel to see fields
    if( layout === 'advanced' ) {
      await user.click(container.querySelector('.tf-button-repeater-overview-open'))
    }

    expect(document.getElementsByClassName('tf-text').length).toBe(0)
    expect(document.getElementsByClassName('tf-number').length).toBe(0)
  })

  it('can add remove, and clear rows', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type   : 'repeater',
        name   : 'test-repeater',
        layout : layout,
        fields : [
          { 
            type  : 'text',
            label : 'Label text',
            name  : 'text-field'
          }
        ]
      })
    )

    expect(document.querySelector(`.tf-repeater-items`)).toBeTruthy()
    expect(document.querySelector(`.tf-repeater-${layout}-items`)).toBeTruthy()
    
    const itemsContainer = document.querySelector(`.tf-repeater-items`)

    expect(itemsContainer.children.length).toBe(1)

    await user.click(within(container).getByText('Add item'))
    await user.click(within(container).getByText('Add item'))
    await user.click(within(container).getByText('Add item'))

    expect(itemsContainer.children.length).toBe(4)
    
    const repeater = fields.store.getRepeater('test-repeater')
    const initialRowKeys = [ 
      repeater.getRow(0).key,
      repeater.getRow(1).key,
      repeater.getRow(2).key,
      repeater.getRow(3).key
    ]

    // Confirmation popup - Cancel
    
    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()
    await user.click(within(itemsContainer.children[2]).getByText(removeText))
    expect(document.querySelector(`.tf-modal-container`)).toBeTruthy()
    await user.click(within(document.querySelector(`.tf-modal-container`)).getByText('Cancel'))
    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()

    expect(itemsContainer.children.length).toBe(4)

    // Confirmation popup - Delete second item

    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()
    await user.click(within(itemsContainer.children[1]).getByText(removeText))
    expect(document.querySelector(`.tf-modal-container`)).toBeTruthy()
    await user.click(within(document.querySelector(`.tf-modal-container`)).getByText(removeText))
    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()

    expect(itemsContainer.children.length).toBe(3)
    
    const currentsRowKeys = [ 
      repeater.getRow(0).key,
      repeater.getRow(1).key,
      repeater.getRow(2).key
    ]

    expect(currentsRowKeys[0]).toBe(initialRowKeys[0])
    expect(currentsRowKeys[1]).toBe(initialRowKeys[2])
    expect(currentsRowKeys[2]).toBe(initialRowKeys[3])

    expect(itemsContainer.children.length).toBe(3)

    // Confirmation popup - Cancel

    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()
    await user.click(within(container).getByText('Remove all'))
    expect(document.querySelector(`.tf-modal-container`)).toBeTruthy()
    await user.click(within(document.querySelector(`.tf-modal-container`)).getByText('Cancel'))
    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()

    expect(itemsContainer.children.length).toBe(3)

    // Confirmation popup - Delete all

    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()
    await user.click(within(container).getByText('Remove all'))
    expect(document.querySelector(`.tf-modal-container`)).toBeTruthy()
    await user.click(within(document.querySelector(`.tf-modal-container`)).getByText('Remove all'))
    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()

    expect(itemsContainer.children.length).toBe(0)
  })

  it('removes action buttons when repeatable false', () => {

    const { container } = render(
      fields.render({
        type       : 'repeater',
        layout     : layout,
        repeatable : false,
        fields     : [
          {
            name  : 'test',
            label : 'Test 1',
            type  : 'text'
          },
          {
            name  : 'test2',
            label : 'Test 2',
            type  : 'text'
          }
        ],
      })
    )

    expect(within(container).queryByText('Duplicate')).toBeFalsy()
    expect(within(container).queryByText('Edit')).toBeFalsy()
    expect(within(container).queryByText('Remove')).toBeFalsy()
    expect(within(container).queryByText('Delete')).toBeFalsy()
    expect(within(container).queryByText('Add item')).toBeFalsy()
    expect(within(container).queryByText('Remove all')).toBeFalsy()
    expect(within(container).queryByText('Clone')).toBeFalsy()
  })

  it('supports maxlength property', async () => {
    
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type       : 'repeater',
        layout     : layout,
        maxlength  : 2,
        fields     : [
          {
            name  : 'test',
            label : 'Test 1',
            type  : 'text'
          },
          {
            name  : 'test2',
            label : 'Test 2',
            type  : 'text'
          }
        ],
      })
    )
    
    let addButton, cloneButton

    addButton = within(container).getByText('Add item')
    expect(addButton).not.toBeDisabled()

    if( layout !== 'bare' ) {
      cloneButton  = within(container).getByText(cloneText)
      expect(cloneButton).not.toBeDisabled()
    }

    await user.click(within(container).getByText('Add item'))

    addButton = within(container).getByText('Add item')
    expect(addButton).toBeDisabled()
    
    if( layout !== 'bare' ) {
      cloneButton  = within(container).getAllByText(cloneText)
      expect(cloneButton[0]).toBeDisabled()
      expect(cloneButton[1]).toBeDisabled()
    }

    await user.click(within(container).getAllByText(removeText)[0])
    await user.click(within(document.querySelector(`.tf-modal-container`)).getByText(removeText)) // Confirmation popup

    addButton = within(container).getByText('Add item')
    expect(addButton).not.toBeDisabled()

    if( layout !== 'bare' ) {
      cloneButton  = within(container).getByText(cloneText)
      expect(cloneButton).not.toBeDisabled()
    }
  })
}

export { commonRepeaterTests }
