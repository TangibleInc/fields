import '../../../../../assets/src/index.jsx'
import userEvent from '@testing-library/user-event'
import { 
  within,
  render,
  screen 
} from '@testing-library/react'
import { 
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription
} from '../../../utils/fields.js'

const fields = window.tangibleFields

describe('List component', () => {

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
  
    const classes = container.firstChild.firstChild.classList
  
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

  it('can add and remove items', () => {

    const { container } = render(
      fields.render({
        type        : 'list',
        label       : `Label for list`,
        description : `Description for list`,
        choices     : {
          test1 : 'Test1', 
          test2 : 'Test2', 
          test3 : 'Test3' 
        }
      }
    ))
  
    const items = container.getElementsByClassName(`tf-list-item`)
    expect(items.length).toEqual(0)
  })

})
