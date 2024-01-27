import '../../../../../assets/src/index.jsx'
import { commonRepeaterTests } from './common.js'
import { within, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

const fields = window.tangibleFields

describe('Repeater with an advanced layout', () => {
  
  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('advanced')

  it('renders all field labels in the headers by default', () => {

    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : 'advanced',
        fields : [
          {
            name  : 'test',
            label : 'Test 1',
            type  : 'text'
          },
          {
            name  : 'test2',
            label : 'Test 2',
            type  : 'text'
          }
        ]
      })
    )

    const header = container.querySelector('.tf-repeater-advanced-header')
    const overview = container.querySelector('.tf-repeater-advanced-overview-item-container')

    expect(within(overview).queryByText('Duplicate')).toBeTruthy()
    expect(within(header).getByText('Test 1')).toBeTruthy()
    expect(within(header).getByText('Test 2')).toBeTruthy()
  })

  it('renders only defined field labels in the headers when headerFields is used', () => {

    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : 'advanced',
        fields : [
          {
            name  : 'test',
            label : 'Test 1',
            type  : 'text'
          },
          {
            name  : 'test2',
            label : 'Test 2',
            type  : 'text'
          }
        ],
        headerFields : [
          'test2'
        ],
      })
    )

    const header = container.querySelector('.tf-repeater-advanced-header')

    expect(within(header).queryByText('Test 1')).toBeFalsy()
    expect(within(header).getByText('Test 2')).toBeTruthy()
  })
})
