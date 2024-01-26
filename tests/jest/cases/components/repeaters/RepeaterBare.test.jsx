import '../../../../../assets/src/index.jsx'
import { commonRepeaterTests } from './common.js'
import { within, render } from '@testing-library/react'

const fields = window.tangibleFields

describe('Repeater with a bare layout', () => {
  
  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('bare')

  it('renders with element inside fields', () => {

    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : 'bare',
        fields : [
          {
            name        : 'test',
            label       : 'Test 1',
            content     : 'Test 1',
            type        : 'description',
            renderType  : 'element'
          },
          {
            name        : 'test2',
            label       : 'Test 2',
            type        : 'text'
          }
        ]
      })
    )

    const items = container.querySelector('.tf-repeater-items')
    expect(container.querySelector('.tf-description'))
    expect(within(items).getByText('Test 1')).toBeTruthy()
    
    expect(container.querySelector('.tf-text'))
    expect(within(items).getByText('Test 2')).toBeTruthy()
      
  })

})
