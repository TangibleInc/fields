import { render, within } from '@testing-library/react'
import '../../../../../assets/src/index.jsx'
import controls from '../../../../../assets/src/controls-list.js'
import { commonRepeaterTests } from './common.js'

const fields = window.tangibleFields

describe('Repeater with a table layout', () => {
  
  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('table')

  // Remove control with subfields + hidden because no label 
  const controlTypes = Object.keys(controls).filter(type => (
    ! ['accordion', 'field-group', 'hidden', 'repeater'].includes(type)
  ))

  test.each(controlTypes)('renders an hidden label in the cells for accessibility with %p type', type => {

    render(
      fields.render({
        type   : 'repeater',
        layout : 'table',
        fields : [
          {
            label : 'Label name',
            type  : type,
            name  : 'name',
          }
        ]
      })
    )

    const headerContainer = document.querySelector(`thead`)

    expect(within(headerContainer).getByText('Label name')).toBeTruthy()

    const itemsContainer = document.querySelector(`.tf-repeater-items`)

    const visuallyHiddenStyle = 'border: 0px; clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;';

    const labels = within(itemsContainer)
      .getAllByText('Label name')
      .filter(label => label.classList.contains('tf-label')) // We only want to test label from our Label component
    
    /**
     * 2 particular cases:
     *  - Text suggestion has 2 label
     *  - Checkbox label is not fully hidden as the checkbox input element needs to always be visible
     */
    if( type === 'checkbox' ) {
      expect(labels.length).toBe(0)
      return;
    }
    expect(labels.length).toBe(type === 'text-suggestion' ? 2 : 1)
    expect(labels[0].parentNode.getAttribute('style')).toBe(visuallyHiddenStyle)
  })
  
})
