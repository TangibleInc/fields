import '@testing-library/jest-dom'
import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as fields from '../../../../../assets/src/index.jsx'

/**
 * Run common tests that must succeed for all repeater types
 *
 * TODO:
 * - Tests with initial value
 * - Test clone button (check key is different)
 */
const commonRepeaterTests = (layout, args = {}) => {

  const config = {
    addText       : 'Add item',
    cloneText     : 'Clone',
    removeText    : 'Remove',
    removeElement : false,
    ...args
  }

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

    await user.click(within(container).getByText(config.addText))
    await user.click(within(container).getByText(config.addText))
    await user.click(within(container).getByText(config.addText))

    expect(itemsContainer.children.length).toBe(4)

    const repeater = fields.store.getRepeater('test-repeater')
    const initialRowKeys = [
      repeater.getRow(0).key,
      repeater.getRow(1).key,
      repeater.getRow(2).key,
      repeater.getRow(3).key
    ]

    const removeElement = async index => (
      config.removeElement
        ? config.removeElement(index, { itemsContainer, user, document }, config)
        : user.click(within(itemsContainer.children[index]).getByText(config.removeText))
    )

    // Confirmation popup - Cancel

    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()
    await removeElement(2)
    expect(document.querySelector(`.tf-modal-container`)).toBeTruthy()
    await user.click(within(document.querySelector(`.tf-modal-container`)).getByText('Cancel'))
    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()

    expect(itemsContainer.children.length).toBe(4)

    // Confirmation popup - Delete second item

    expect(document.querySelector(`.tf-modal-container`)).toBeFalsy()
    await removeElement(1)
    expect(document.querySelector(`.tf-modal-container`)).toBeTruthy()
    await user.click(within(document.querySelector(`.tf-modal-container`)).getByText(config.removeText))
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

    // Remove all is not supported by the tab layout (for now?)
    if ( layout === 'tab' ) return;

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
    expect(within(container).queryByText(config.addText)).toBeFalsy()
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

    addButton = within(container).getByText(config.addText)
    expect(addButton).not.toBeDisabled()

    if( layout !== 'bare' ) {
      cloneButton = within(container).getByText(config.cloneText)
      expect(cloneButton).not.toBeDisabled()
    }

    await user.click(within(container).getByText(config.addText))

    addButton = within(container).getByText(config.addText)
    expect(addButton).toBeDisabled()

    if( layout === 'tab' ) {
      cloneButton = within(container).getByText(config.cloneText)
      cloneButton = cloneButton.parentNode // Child element because visually hidden
      expect(cloneButton).toBeDisabled()
    }
    else if( layout !== 'bare' ) {
      cloneButton = within(container).getAllByText(config.cloneText)
      expect(cloneButton[0]).toBeDisabled()
      expect(cloneButton[1]).toBeDisabled()
    }

    await user.click(within(container).getAllByText(config.removeText)[0])
    await user.click(within(document.querySelector(`.tf-modal-container`)).getByText(config.removeText)) // Confirmation popup

    addButton = within(container).getByText(config.addText)
    expect(addButton).not.toBeDisabled()

    if( layout !== 'bare' ) {
      cloneButton  = within(container).getByText(config.cloneText)
      expect(cloneButton).not.toBeDisabled()
    }
  })

  it('renders with element inside fields', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : layout,
        fields : [
          {
            name    : 'test',
            label   : 'Test 1',
            content : 'Test 1',
            type    : 'description',
          },
          {
            name    : 'test2',
            label   : 'Test 2',
            type    : 'text'
          }
        ]
      })
    )

    // Needs to open panel to see fields
    if( layout === 'advanced' ) {
      await user.click(container.querySelector('.tf-button-repeater-overview-open'))
    }
    else if( layout === 'tab' ) {
      await user.click(within(container).getByText('Item 1'))
    }

    const items = container.querySelector(
      layout !== 'tab'
        ? '.tf-repeater-items'
        : '.tf-repeater-tab-content'
    )

    expect(container.querySelector('.tf-description'))
    expect(
      layout !== 'tab'
        ? within(items).getByText('Test 1')
        : within(items).getAllByText('Test 1') // label + visually hidden
    ).toBeTruthy()

    expect(container.querySelector('.tf-text'))
    expect(
      layout !== 'tab'
        ? within(items).getByText('Test 2')
        : within(items).getAllByText('Test 2') // label + visually hidden
    ).toBeTruthy()
  })

  it('passes the row index as a props in subfields', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : layout,
        name   : 'test',
        fields : [
          {
            name  : 'test2',
            label : 'Test 1',
            type  : 'text'
          }
        ],
      })
    )

    let hasProps = false
    fields.event('valueChange', ({ props }) => {

      if( props.itemType !== 'subtype' && props.name !== 'test2' ) {
        return;
      }

      hasProps = props.repeaterRow === 0
    })

    // Needs to open panel to see fields
    if( layout === 'advanced' ) {
      await user.click(container.querySelector('.tf-button-repeater-overview-open'))
    }

    await user.type(container.querySelector('.cm-line'), 'a')

    expect(hasProps).toBe(true)
  })

  it('support custom strings', async () => {

    const { container } = render(
      fields.render({
        type    : 'repeater',
        layout  : layout,
        name    : 'test',
        strings : {
          add    : 'add custom text'
        },
        fields  : [
          {
            name  : 'test2',
            label : 'Test 1',
            type  : 'text'
          }
        ],
      })
    )

    expect(within(container).queryByText(config.addText)).toBeFalsy()
    expect(within(container).getByText('add custom text')).toBeTruthy()
  })

  it('support custom layout for the deletion button', async () => {

    const CustomButton = props => (
      <button onClick={ () => props.dispatch({
        type : 'remove',
        item : props.item
      }) }>
        Custom button
      </button>
    )

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type    : 'repeater',
        layout  : layout,
        name    : 'test',
        parts   : { actions : { delete : CustomButton } },
        fields  : [
          {
            name  : 'test2',
            label : 'Test 1',
            type  : 'text'
          }
        ],
      })
    )

    const items = document.querySelector(`.tf-repeater-items`)
    expect(items.children.length).toBe(1)

    const deleteButton = within(container).getByText('Custom button')
    await user.click(deleteButton)

    expect(items.children.length).toBe(0)
  })

  it('support custom layout for the clone button', async () => {

    if ( layout === 'bare' ) return; // No clone button for this layout

    const CustomButton = props => (
      <button onClick={ () => props.dispatch({
        type : 'clone',
        item : props.items[ props.item ]
      }) }>
        Custom button
      </button>
    )

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type    : 'repeater',
        layout  : layout,
        name    : 'test',
        parts   : { actions : { clone : CustomButton } },
        fields  : [
          {
            name  : 'test2',
            label : 'Test 1',
            type  : 'text'
          }
        ],
      })
    )

    const items = document.querySelector(`.tf-repeater-items`)
    expect(items.children.length).toBe(1)

    const deleteButton = within(container).getByText('Custom button')
    await user.click(deleteButton)

    expect(items.children.length).toBe(2)
  })

  it('support exclude props when cloning', async () => {

    const user = userEvent.setup()
    const store = fields.store

    const { container } = render(
      fields.render({
        type    : 'repeater',
        layout  : layout,
        name    : 'test',
        clone   : {
          exclude   : {
            id        : true,
            name2     : { id: true },
            name4     : { id: true },
          }
        },
        value   : [
          {
            key   : 'something',
            id    : 10,
            name1 : 'Text value',
            name2 : {
              id      : 20,
              name3   : 'Text value 2'
            },
            name4 : [
              {
                id    : 30,
                name5 : 'Text value 3'
              },
              {
                id    : 40,
                name5 : 'Text value 4'
              }
            ],
          }
        ],
        fields  : [
          {
            name      : 'id',
            type      : 'hidden'
          },
          {
            name      : 'name1',
            label     : 'Test 1',
            type      : 'text'
          },
          {
            name      : 'name2',
            label     : 'Test 2',
            type      : 'field-group',
            fields    : [
              {
                name    : 'id',
                type    : 'hidden'
              },
              {
                name    : 'text-name',
                label   : 'Text',
                type    : 'text'
              },
            ]
          },
          {
            name      : 'name4',
            label     : 'Test 2',
            type      : 'repeater',
            // To be sure there is only one clone button, easier to test
            parts     : { actions : { clone : props => <></> } },
            fields    : [
              {
                name  : 'id',
                type  : 'hidden'
              },
              {
                name  : 'name5',
                label : 'Text',
                type  : 'text'
              },
            ]
          },
        ],
      })
    )

    // Does not have a clone button
    if( layout === 'bare' ) return;

    const cloneButton = within(container).getByText(config.cloneText)
    await user.click(cloneButton)

    const repeater = store.getRepeater('test')

    expect( repeater.getRowValue('0', 'id') ).toBe(10)
    expect( repeater.getRowValue('1', 'id') ).not.toBe(10)

    expect( repeater.getRowValue('0', 'name1') ).toBe('Text value')
    expect( repeater.getRowValue('1', 'name1') ).toBe('Text value')

    const fieldGroup1 = repeater.getRowValue('0', 'name2')
    const fieldGroup2 = repeater.getRowValue('1', 'name2')

    expect( fieldGroup1.id ).toBe(20)
    expect( fieldGroup2.id ).not.toBe(20)

    expect( fieldGroup1.name3 ).toBe('Text value 2')
    expect( fieldGroup2.name3 ).toBe('Text value 2')

    const subRepeater1 = repeater.getRowValue('0', 'name4')
    const subRepeater2 = repeater.getRowValue('1', 'name4')

    expect( subRepeater1[0].id ).toBe(30)
    expect( subRepeater2[0].id ).not.toBe(30)

    expect( subRepeater1[1].id ).toBe(40)
    expect( subRepeater2[1].id ).not.toBe(40)

    expect( subRepeater1[0].name5 ).toBe('Text value 3')
    expect( subRepeater2[0].name5 ).toBe('Text value 3')

    expect( subRepeater1[1].name5 ).toBe('Text value 4')
    expect( subRepeater2[1].name5 ).toBe('Text value 4')
  })

  it('supports newItem', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type   : 'repeater',
        name   : 'repeater-test',
        layout : layout,
        fields : [
          {
            label : 'Text',
            type  : 'text',
            name  : 'text-field'
          },
          {
            label : 'Date',
            type  : 'date',
            name  : 'date-field'
          }
        ],
        newItem : {
          'text-field' : 'Default value for new item'
        }
      })
    )

    let value = JSON.parse(
      container.querySelector('input[name=repeater-test]').value
    )

    expect(Array.isArray(value)).toBe(true)
    expect(value.length).toBe(1)

    expect(value[0]['text-field']).toBe('Default value for new item')
    expect(value[0]['date-field']).toBe('')

    await user.click(within(container).getByText(config.addText))

    value = JSON.parse(
      container.querySelector('input[name=repeater-test]').value
    )

    expect(Array.isArray(value)).toBe(true)
    expect(value.length).toBe(2)

    expect(value[0]['text-field']).toBe('Default value for new item')
    expect(value[0]['date-field']).toBe('')

    expect(value[1]['text-field']).toBe('Default value for new item')
    expect(value[1]['date-field']).toBe('')
  })

}

export { commonRepeaterTests }
