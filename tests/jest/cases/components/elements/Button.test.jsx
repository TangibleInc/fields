import '../../../../../assets/src/index.jsx'
import { renderHasElement } from '../../../utils/elements.js'
import { within } from '@testing-library/react'

describe('Button component', () => {

  it('renders', () => {
    renderHasElement({ type: 'button' }, container => container.getElementsByTagName('button')[0])
  })

  it('has a class when context is not default', () => {  
    renderHasElement({ 
      type    : 'button',
      context : 'wp'
    }, container => container.querySelector('.tf-button-is-wp'))
  })

  it('supports layout parameter', () => {
    renderHasElement({ 
      type   : 'button',
      layout : 'custom'
    }, container => container.querySelector('.tf-button-custom'))
  })

  it('can set content from content parameter', () => {
    renderHasElement({ 
      type    : 'button',
      content : 'Button text'
    }, container => within(container).getByText('Button text'))
  })

  it('supports span with changeTag', () => {
    renderHasElement({ 
      type      : 'button',
      changeTag : 'span'
    }, container => container.getElementsByTagName('span')[0])
  })

  it('supports custom class names, custom style and contentVisuallyHidden parameters', () => {
    const visuallyHiddenStyle = 'border: 0px; clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;';
    renderHasElement({ 
      type                  : 'button',
      className             : 'custom-class',
      style                 : { backgroundColor: 'red' },
      contentVisuallyHidden : true
    }, container => {
      expect(container.querySelector('.custom-class').getAttribute('style')).toBe('background-color: red;')      
      expect(container.querySelector('.custom-class').firstChild.getAttribute('style')).toBe(visuallyHiddenStyle)
      return container.querySelector('.custom-class')
    })
  })

})
