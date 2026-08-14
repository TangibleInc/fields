import * as fields from '../../../../../assets/src/index.tsx'
import { render, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import {
  getFieldElement,
  rendersWithMinimal,
  rendersLabelAndDescription,
  renderHasElement,
  renderHasNotElement
} from '../../../utils/fields.ts'

const choices = {
  choice1 : 'Choice 1',
  choice2 : 'Choice 2'
}

/**
 * Each option is a radio of the segmented control, the selected one is
 * identified with aria-checked
 */
const getOption = (container, label) => within(container).getByRole('radio', { name: label })

const getCheckedLabels = container => (
  [ ...container.querySelectorAll('[role="radio"][aria-checked="true"]') ].map(option => option.textContent)
)

describe('Button group component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'button-group' }))
  it('renders when no label', () => {

    const { container } = render(fields.render({ type: 'button-group' }))

    expect(getFieldElement(container).classList.contains('tf-button-group')).toEqual(true)
  })

  it('renders label and description', () => rendersLabelAndDescription({ type: 'button-group' }))

  it('renders', () => {

    const { container } = render(
      fields.render({
        label   : 'Button group',
        name    : 'button-group-name',
        type    : 'button-group',
        choices : choices
      })
    )

    const group = container.getElementsByClassName('tf-button-group')
    expect(group.length).toBe(1)

    const options = within(group[0]).getAllByRole('radio')
    expect(options.length).toBe(2)

    expect(options[0].textContent).toBe('Choice 1')
    expect(options[1].textContent).toBe('Choice 2')

    /**
     * The value is submitted with an hidden input
     */
    expect(container.querySelector('input[type="hidden"]').value).toBe('')
  })

  it('renders dashicons', () => {

    const { container } = render(
      fields.render({
        label        : 'Button group',
        name         : 'button-group-name',
        type         : 'button-group',
        use_dashicon : true,
        choices      : {
          left  : 'editor-alignleft',
          right : 'editor-alignright'
        }
      })
    )

    expect(container.querySelectorAll('.dashicons').length).toBe(2)
    expect(container.querySelector('.dashicons-editor-alignleft')).toBeTruthy()

    /**
     * The dashicon name is used as accessible name, there is no visible label
     */
    expect(getOption(container, 'editor-alignleft')).toBeTruthy()
  })

  it('displays the selected value', () => {

    const { container } = render(
      fields.render({
        label   : 'Button group',
        name    : 'button-group-name',
        type    : 'button-group',
        value   : 'choice2',
        choices : choices
      })
    )

    expect(getCheckedLabels(container)).toEqual([ 'Choice 2' ])
    expect(container.querySelector('input[type="hidden"]').value).toBe('choice2')
  })

  it('supports value change', async () => {

    const onChange = jest.fn()
    const user = userEvent.setup()

    const { container } = render(
      fields.render({
        label    : 'Button group',
        name     : 'button-group-name',
        type     : 'button-group',
        value    : 'choice1',
        choices  : choices,
        onChange : onChange
      })
    )

    await user.click(getOption(container, 'Choice 2'))

    expect(onChange).toHaveBeenCalledWith('choice2')
    expect(getCheckedLabels(container)).toEqual([ 'Choice 2' ])
    expect(container.querySelector('input[type="hidden"]').value).toBe('choice2')
  })

  it('supports readOnly', async () => {

    const config = {
      label   : 'Button group',
      type    : 'button-group',
      value   : 'choice1',
      choices : choices
    }

    renderHasElement(config, container => container.querySelector('[role="radiogroup"]'))
    renderHasNotElement(config, container => container.querySelector('[role="radiogroup"][aria-disabled="true"]'))

    config.isDisabled = false

    renderHasElement(config, container => container.querySelector('[role="radiogroup"]'))
    renderHasNotElement(config, container => container.querySelector('[role="radiogroup"][aria-disabled="true"]'))

    /**
     * Both prop names are accepted: read_only is mapped to isDisabled for the
     * button group, while the other TUI fields receive readOnly
     *
     * @see fields/format.php
     */
    config.isDisabled = true

    renderHasElement(config, container => container.querySelector('[role="radiogroup"][aria-disabled="true"]'))
    renderHasElement(config, container => container.querySelector('.tui-field.is-disabled'))

    delete config.isDisabled
    config.readOnly = true

    renderHasElement(config, container => container.querySelector('[role="radiogroup"][aria-disabled="true"]'))
    renderHasElement(config, container => container.querySelector('.tui-field.is-disabled'))

    /**
     * The value can't be changed when the field is read only
     */
    const user = userEvent.setup()
    const { container } = render(fields.render(config))

    await user.click(getOption(container, 'Choice 2'))

    expect(getCheckedLabels(container)).toEqual([ 'Choice 1' ])
  })

  it('supports disabled choices', async () => {

    const user = userEvent.setup()

    const { container } = render(
      fields.render({
        label        : 'Button group',
        name         : 'button-group-name',
        type         : 'button-group',
        value        : 'choice1',
        disabledKeys : [ 'choice2' ],
        choices      : choices
      })
    )

    expect(getOption(container, 'Choice 1').getAttribute('aria-disabled')).toBeNull()
    expect(getOption(container, 'Choice 2').getAttribute('aria-disabled')).toBe('true')

    await user.click(getOption(container, 'Choice 2'))

    expect(getCheckedLabels(container)).toEqual([ 'Choice 1' ])
  })

})
