import '../../../../../assets/src/index.jsx'
import { renderHasElement } from '../../../utils/elements.js'
import { 
  render,
  screen
} from '@testing-library/react'

const fields = window.tangibleFields

describe('Label component', () => {

  it('renders', () => {
    renderHasElement({ type: 'label' }, container => container.getElementsByTagName('label')[0])
  })

  it('can set text from content parameter', () => {
    
    render(
      fields.render({
        type    : 'label',
        content : `Label text`,
      }, 'element')
    )

    const label = screen.getByText('Label text')
    expect(label).toBeTruthy()
  })

  it('supports contentVisuallyHidden', () => {
    
    const { container } = render(
      fields.render({
        type    : 'label',
        content : `Label text`,
        parent  : { labelVisuallyHidden : true }
      }, 'element')
    )

    const visuallyHiddenStyle = 'border: 0px; clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;';
    expect(container.querySelector('.tf-label').parentNode.getAttribute('style')).toBe(visuallyHiddenStyle)
  })

})
