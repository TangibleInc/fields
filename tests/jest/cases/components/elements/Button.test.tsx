import * as fields from '../../../../../assets/src/index.tsx'
import { renderHasElement } from '../../../utils/elements.ts'
import userEvent from '@testing-library/user-event'
import { 
  within,
  render
} from '@testing-library/react'

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

  it('trigger an event when button is pressed', async () => {
  
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type    : 'button',
        content : 'Button text',
        name    : 'button-name' 
      }, 'element')
    )

    let buttonName = ''
    fields.event('buttonPressed', ({ name }) => {
      buttonName = name
    })
    
    await user.click(within(container).getByText('Button text'))
    
    expect(buttonName).toBe('button-name')
  })

  it('uses button as element type when buttonType is not set', () => {
  
    const { container } = render(
      fields.render({
        type    : 'button',
        content : 'Button text',
        name    : 'button-name' 
      }, 'element')
    )
    
    const button = within(container).getByText('Button text')
    expect(button.getAttribute('type')).toBe('button')
  })

  it('support buttonType attribute', () => {
  
    const { container } = render(
      fields.render({
        type       : 'button',
        content    : 'Button text',
        name       : 'button-name',
        buttonType : 'submit'
      }, 'element')
    )
    
    const button = within(container).getByText('Button text')
    expect(button.getAttribute('type')).toBe('submit')
  })
})
