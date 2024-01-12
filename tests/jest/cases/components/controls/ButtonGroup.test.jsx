import '../../../../../assets/src/index.jsx'
import { render } from '@testing-library/react'
import {
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription,
  renderHasElement,
  renderHasNotElement
} from '../../../utils/fields.js'

const fields = window.tangibleFields

describe('Button group component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'button-group' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'button-group' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'button-group' }))
  
  it('renders', () => {
    
      render( 
        <>
          { fields.render({
            label   : 'Button group',
            name    : 'button-group-name',
            type    : 'button-group',
            choices : {
              choice1 : 'Choice 1', 
              choice2 : 'Choice 2'
            }
          }) }
        </>
      )

      const select = document.getElementsByClassName('tf-button-group')
      expect(select.length).toBe(1)

      const items = select[0].getElementsByClassName('tf-button-group-option')
      expect(items.length).toBe(2)

  })

  it('supports readOnly', () => {

    const config = { 
      label   : 'Button group',
      type    : 'button-group',
      choices : {
        choice1 : 'Choice 1', 
        choice2 : 'Choice 2'
      }, 
    }

    renderHasElement(config, container => container.querySelector('.tf-button-group-container'))
    renderHasNotElement(config, container => container.querySelector('.tf-button-group-container[aria-disabled]'))

    config.isDisabled = false

    renderHasElement(config, container => container.querySelector('.tf-button-group-container'))
    renderHasNotElement(config, container => container.querySelector('.tf-button-group-container[aria-disabled]'))

    config.isDisabled = true

    renderHasElement(config, container => container.querySelector('.tf-button-group-container'))
    renderHasElement(config, container => container.querySelector('.tf-button-group-container[aria-disabled]'))

  })

})
