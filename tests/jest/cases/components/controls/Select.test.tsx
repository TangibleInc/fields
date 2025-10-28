import * as fields from '../../../../../assets/src/index.jsx'
import { render, within } from '@testing-library/react'
import { 
  rendersWithoutLabelThrowWarning,
  renderHasElement,
  renderHasNotElement
} from '../../../utils/fields.js'

describe('Select component', () => {

  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'select' }))
  
  it('renders', () => {
    
    render( 
      <>
        { fields.render({
          label   : 'Select',
          name    : 'select-name',
          type    : 'select',
          choices : {
            choice1 : 'Choice 1', 
            choice2 : 'Choice 2'
          }
        }) }
      </>
    )

    const select = document.getElementsByClassName('tf-select')
    expect(select.length).toBe(1)

    const items = select[0].getElementsByClassName('tf-button-select')
    expect(items.length).toBe(1)

    const currentChoice = items[0].textContent
    expect(currentChoice).toContain('Select an option')
  })
 
  it('renders label and description', () => {
    
    const { container } = render( 
      <>
        { fields.render({
          label       : 'Label for select',
          description : 'Description for select',
          name        : 'select-name',
          type        : 'select',
          choices     : {
            choice1 : 'Choice 1', 
            choice2 : 'Choice 2'
          }
        }) }
      </>
    )

    const classes = container.firstChild.firstChild.classList

    expect(classes.contains(`tf-select`)).toEqual(true)
  
    const label = within(container).getAllByText(`Label for select`)
    const description = within(container).getByText(`Description for select`)
  
    expect(label.length).toBe(2)
    expect(description).toBeTruthy()

  })

  it('supports readOnly', () => {

    const config = { 
      type    : 'select', 
      label   : 'Label',
      choices : {
        choice1 : 'Choice 1', 
        choice2 : 'Choice 2'
      },
    }

    renderHasElement(config, container => container.querySelector('.tf-button-select'))
    renderHasNotElement(config, container => container.querySelector('.tf-button-select[disabled]'))

    config.isDisabled = false

    renderHasElement(config, container => container.querySelector('.tf-button-select'))
    renderHasNotElement(config, container => container.querySelector('.tf-button-select[disabled]'))

    config.isDisabled = true

    renderHasElement(config, container => container.querySelector('.tf-button-select'))
    renderHasElement(config, container => container.querySelector('.tf-button-select[disabled]'))

  })

})
