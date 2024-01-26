import '../../../../../assets/src/index.jsx'
import { commonRepeaterTests } from './common.js'
import { within, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

const fields = window.tangibleFields

describe('Repeater with a block layout', () => {
  
  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('block')

  it('renders with element inside fields', async () => {

    const user = userEvent.setup()

    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : 'block',
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

    await user.click(container.querySelector('.tf-button-repeater-overview-open'))

    const items = container.querySelector('.tf-repeater-items')
    expect(container.querySelector('.tf-description'))
    expect(within(items).getByText('Test 1')).toBeTruthy()
    
    expect(container.querySelector('.tf-text'))
    expect(within(items).getByText('Test 2')).toBeTruthy()
      
  })
})
