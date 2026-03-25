import { render, within } from '@testing-library/react'
import * as fields from '../../../../../assets/src/index.tsx'
import { commonRepeaterTests } from './common.ts'

describe('Repeater with a table layout', () => {
  
  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('table')

  // Remove control with subfields + hidden because no label 
  const controlTypes = Object.keys(fields.types._types['control']).filter(type => (
    ! ['accordion', 'field-group', 'hidden', 'repeater', 'conditional-panel', 'tab'].includes(type)
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
      .filter(label =>
        label.classList.contains('tf-label') ||
        label.classList.contains('tui-field__label') ||
        label.classList.contains('tui-visually-hidden')
      )
    
    /**
     * Text suggestion and list have 2 labels (because of child combobox)
     */
    expect(labels.length).toBe(
      ['text-suggestion', 'list'].includes(type)
        ? 2
        : 1
    )

    // TUI fields use `hidden` prop which adds a class; legacy fields use inline VisuallyHidden style
    const isHiddenByStyle = labels[0].parentNode.getAttribute('style') === visuallyHiddenStyle
    const isHiddenByClass = labels[0].classList.contains('tui-visually-hidden')
      || labels[0].parentNode.classList.contains('tui-visually-hidden')
    expect(isHiddenByStyle || isHiddenByClass).toBe(true)
  })
})
