import * as fields from '../../../../../assets/src/index.tsx'
import { 
  render,
  screen,
  within
} from '@testing-library/react'
import {
  getFieldElement,
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning
} from '../../../utils/fields.ts'
import { userEvent } from '@testing-library/user-event'

describe('List component', () => {

  const openChoices = (user, container) => (
    user.click(container.querySelector('input[role="combobox"]'))
  )

  it('renders with minimal config', () => rendersWithMinimal({ type: 'list' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'list' }))
  
  it('renders label and description', () => {

    const { container } = render(
      fields.render({
        type        : 'list',
        label       : `Label for list`,
        description : `Description for list`
      }
    ))
  
    const classes = getFieldElement(container).classList
  
    expect(classes.contains(`tf-list`)).toEqual(true)
  
    const label = screen.getAllByText(`Label for list`)
    const description = screen.getByText(`Description for list`)
  
    expect(label).toBeTruthy()
    expect(label.length).toBe(2) // Hidden label from combobox
    expect(description).toBeTruthy()
  })

  it('contains no items if no value', () => {

    const { container } = render(
      fields.render({
        type        : 'list',
        label       : `Label for list`,
        description : `Description for list`
      }
    ))
  
    const items = container.getElementsByClassName(`tf-list-item`)
    expect(items.length).toEqual(0)
  })

  it('uses initial value and deletes', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type        : 'list',
        label       : `Label for list`,
        description : `Description for list`,
        choices     : {
          test1 : 'Test1', 
          test2 : 'Test2', 
          test3 : 'Test3'
        },
        value       : JSON.stringify([
          { value: 'test1', _canDelete: true },
          { value: 'test2', _canDelete: false }
        ]) 
      }
    ))
  
    let items = container.getElementsByClassName(`tf-list-item`)
    expect(items.length).toEqual(2)

    // Only one has _canDelete
    let deleteButtons = document.getElementsByClassName(`tf-button-icon-trash`) 
    expect(deleteButtons.length).toEqual(1)

    // Not used if unspecified
    let visibilityButtons = document.getElementsByClassName(`tf-button-icon-eye`) 
    expect(visibilityButtons.length).toEqual(0)

    await openChoices(user, container)

    // Already selected items should be disabled
    expect(document.querySelectorAll(`.tui-combobox__option`).length).toEqual(3)
    expect(document.querySelectorAll(`.tui-combobox__option[data-disabled="true"]`).length).toEqual(2)

    await user.click(deleteButtons[0])

    items = container.getElementsByClassName(`tf-list-item`)
    expect(items.length).toEqual(1)

    deleteButtons = document.getElementsByClassName(`tf-button-icon-trash`) 
    expect(deleteButtons.length).toEqual(0)

    await openChoices(user, container)

    expect(document.querySelectorAll(`.tui-combobox__option`).length).toEqual(3)
    expect(document.querySelectorAll(`.tui-combobox__option[data-disabled="true"]`).length).toEqual(1)
  })

  test.each([
    { directSelection: undefined, hasAddButton: true },
    { directSelection: false,     hasAddButton: true },
    { directSelection: true,      hasAddButton: false },
  ])('renders add button according to directSelection (%p)', ({ directSelection, hasAddButton }) => {

    const { container } = render(
      fields.render({
        type    : 'list',
        label   : `Label for list`,
        choices : {
          test1 : 'Test1',
          test2 : 'Test2',
          test3 : 'Test3'
        },
        ...( directSelection !== undefined ? { directSelection } : {} )
      }
    ))

    hasAddButton
      ? expect(within(container).getByText('Add')).toBeTruthy()
      : expect(within(container).queryByText('Add')).toBe(null)
  })

  it('adds item on selection when directSelection is enabled', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type            : 'list',
        label           : `Label for list`,
        directSelection : true,
        choices : {
          test1 : 'Test1',
          test2 : 'Test2',
          test3 : 'Test3'
        }
      }
    ))

    let items = container.getElementsByClassName(`tf-list-item`)
    expect(items.length).toEqual(0)

    await openChoices(user, container)
    await user.click(within(document).getByText('Test2'))

    items = container.getElementsByClassName(`tf-list-item`)
    expect(items.length).toEqual(1)
    expect(items[0].textContent).toContain('Test2')

    const input = container.querySelector('input[type=hidden]')
    expect(JSON.parse(input.value)).toEqual([
      { value: 'test2', _canDelete: true, _enabled: true }
    ])
  })

  it('supports visibility button', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type          : 'list',
        label         : `Label for list`,
        description   : `Description for list`,
        useVisibility : true,
        choices     : {
          test1 : 'Test1', 
          test2 : 'Test2', 
          test3 : 'Test3'
        },
        value       : JSON.stringify([
          { value: 'test1', _canDelete: true, _enabled: false },
          { value: 'test2', _canDelete: false, _enabled: true }
        ]) 
      }
    ))

    let items = container.getElementsByClassName(`tf-list-item`)
    expect(items.length).toEqual(2)

    let visibilityButtons = document.getElementsByClassName(`tf-button-icon-eye`) 
    expect(visibilityButtons.length).toEqual(2)

    expect(visibilityButtons[0].style.opacity).toEqual('0.5')
    expect(visibilityButtons[1].style.opacity).not.toEqual('0.5')

    await user.click(visibilityButtons[1])

    expect(visibilityButtons[1].style.opacity).toEqual('0.5')
    
    await user.click(visibilityButtons[1])

    expect(visibilityButtons[1].style.opacity).not.toEqual('0.5')
  })
})
