import '../../../../../assets/src/index.tsx'
import { renderHasElement } from '../../../utils/elements.ts'

describe('Tooltip component', () => {

  it('renders', () => {
    renderHasElement({ type: 'tooltip' }, container => container.getElementsByClassName('tf-tooltip-trigger')[0])
  })

  it('use the button layout by default with type=action', () => {
    renderHasElement({ 
      type   : 'tooltip',
    }, container => container.querySelector('.tf-button-action'))
  })

  it('supports the layout parameter set to button, and uses type=action by default', () => {
    renderHasElement({ 
      type   : 'tooltip',
      layout : 'button'
    }, container => container.querySelector('.tf-button-action'))
  })

  it('supports the buttonProps parameter', () => {
    renderHasElement({ 
      type        : 'tooltip',
      layout      : 'button',
      buttonProps : {
        type : 'primary'
      }
    }, container => container.querySelector('.tf-button-primary'))
  })

  it('supports the render with custom JSX components passed as a child', () => {

    renderHasElement({
      type        : 'tooltip',
      children    : <div className="custom-class">Custom component</div>
    }, container => container.querySelector('.custom-class'))
  })

})
