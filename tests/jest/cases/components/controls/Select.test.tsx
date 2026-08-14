import * as fields from '../../../../../assets/src/index.tsx'
import { render, within } from '@testing-library/react'
import {
  getFieldElement,
  renderHasElement,
  renderHasNotElement
} from '../../../utils/fields.ts'

describe('Select component', () => {

  it('renders when no label', () => {

    const { container } = render(fields.render({ type: 'select' }))

    expect(getFieldElement(container).classList.contains('tf-select-field')).toEqual(true)
  })

  it('renders', () => {

    render(
      <>
        { fields.render({
          label   : 'Select',
          name    : 'select-name',
          type    : 'select',
          choices : {
            choice1 : 'Choice 1',
            choice2 : 'Choice 2'
          }
        }) }
      </>
    )

    const select = document.getElementsByClassName('tf-select-field')
    expect(select.length).toBe(1)

    const items = select[0].getElementsByClassName('tui-select__trigger')
    expect(items.length).toBe(1)

    const currentChoice = items[0].textContent
    expect(currentChoice).toContain('Select an option')
  })

  it('renders label and description', () => {

    const { container } = render(
      <>
        { fields.render({
          label       : 'Label for select',
          description : 'Description for select',
          name        : 'select-name',
          type        : 'select',
          choices     : {
            choice1 : 'Choice 1',
            choice2 : 'Choice 2'
          }
        }) }
      </>
    )

    const classes = getFieldElement(container).classList

    expect(classes.contains(`tf-select-field`)).toEqual(true)

    const label = within(container).getAllByText(`Label for select`)
    const description = within(container).getByText(`Description for select`)

    expect(label.length).toBe(1)
    expect(description).toBeTruthy()

  })

  it('supports readOnly', () => {

    const config = {
      type    : 'select',
      label   : 'Label',
      choices : {
        choice1 : 'Choice 1',
        choice2 : 'Choice 2'
      },
    }

    renderHasElement(config, container => container.querySelector('.tui-select__trigger'))
    renderHasNotElement(config, container => container.querySelector('.tui-select__trigger[disabled]'))

    config.isDisabled = false

    renderHasElement(config, container => container.querySelector('.tui-select__trigger'))
    renderHasNotElement(config, container => container.querySelector('.tui-select__trigger[disabled]'))

    config.isDisabled = true

    renderHasElement(config, container => container.querySelector('.tui-select__trigger'))
    renderHasElement(config, container => container.querySelector('.tui-select__trigger[disabled]'))

    /**
     * Both prop names are accepted: read_only is mapped to isDisabled for the
     * select field, while the other TUI fields receive readOnly
     *
     * @see fields/format.php
     */
    delete config.isDisabled
    config.readOnly = true

    renderHasElement(config, container => container.querySelector('.tui-select__trigger'))
    renderHasElement(config, container => container.querySelector('.tui-select__trigger[disabled]'))

  })

  it('supports multiple', () => {

    const config = {
      type     : 'select',
      label    : 'Label',
      multiple : true,
      choices  : {
        choice1 : 'Choice 1',
        choice2 : 'Choice 2'
      },
    }

    renderHasElement(config, container => container.querySelector('.tf-select-multiple'))
    renderHasNotElement(config, container => container.querySelector('.tui-multiselect__trigger[disabled]'))

    config.isDisabled = true

    renderHasElement(config, container => container.querySelector('.tui-multiselect__trigger[disabled]'))

  })

})
