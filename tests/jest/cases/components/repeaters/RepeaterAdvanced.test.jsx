import * as fields from '../../../../../assets/src/index.jsx'
import { commonRepeaterTests } from './common.js'
import { within, render } from '@testing-library/react'

describe('Repeater with an advanced layout', () => {

  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('advanced', {
    cloneText   : 'Duplicate',
    removeText  : 'Delete'
  })

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

  it('renders object.label inside headers', async () => {

    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : 'advanced',
        fields : [
          {
            name      : 'test',
            label     : 'Test 1',
            type      : 'text'
          },
          {
            name      : 'test2',
            label     : 'Test 2',
            type      : 'combo-box',
            isAync    : true,
            searchUrl : 'test.json',
          },
          {
            name      : 'test3',
            label     : 'Test 3',
            type      : 'field-group'
          }
        ],
        value : JSON.stringify([
          {
            test  : 'test',
            test2 : { value: 'value', label: 'Name 1' },
            test3 : { random: 'object' }
          }
        ])
      })
    )

    const header = container.querySelector('.tf-repeater-advanced-header')

    expect(within(header).queryByText('Test 1')).toBeTruthy()
    expect(within(header).queryByText('Test 2')).toBeTruthy()
    expect(within(header).queryByText('Test 3')).toBeTruthy()

    const itemOverview = container.querySelector('.tf-repeater-advanced-overview')

    expect(within(itemOverview).queryByText('test')).toBeTruthy()
    expect(within(itemOverview).queryByText('Name 1')).toBeTruthy()

    const overviewValues = itemOverview.querySelectorAll('.tf-repeater-advanced-label-row-item')
    expect(overviewValues.length).toBe(3)
    expect(overviewValues[2].textContent).toBe('')
  })
})
