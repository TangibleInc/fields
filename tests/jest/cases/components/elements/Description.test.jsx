import * as fields from '../../../../../assets/src/index.jsx'
import { renderHasElement } from '../../../utils/elements.js'
import { 
  render,
  screen
} from '@testing-library/react'

describe('Description component', () => {

  it('renders', () => {
    renderHasElement({ type: 'description' }, container => container.querySelector('.tf-description'))
  })

  it('can set text from content parameter', () => {
    
    render(
      fields.render({
        type    : 'description',
        content : `Description text`,
      }, 'element')
    )

    const description = screen.getByText('Description text')
    expect(description).toBeTruthy()
  })

  it('supports contentVisuallyHidden', () => {
    
    const { container } = render(
      fields.render({
        type    : 'description',
        content : `Description text`,
        parent  : { descriptionVisuallyHidden : true }
      }, 'element')
    )

    const visuallyHiddenStyle = 'border: 0px; clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;';
    expect(container.querySelector('.tf-description').parentNode.getAttribute('style')).toBe(visuallyHiddenStyle)
  })

})
