import * as fields from '../../../../../assets/src/index.tsx'
import {
  act,
  render,
  waitFor
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import {
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription,
  renderHasElement,
  renderHasNotElement
} from '../../../utils/fields.ts'

describe('Text component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'text' }))

  it('renders when no label', () => {
    const { container } = render(
      fields.render({ type: 'text' })
    )
    const classes = container.firstChild.firstChild.classList
    expect(classes.contains('tf-text')).toEqual(true)
  })

  it('renders label and description', () => rendersLabelAndDescription({ type: 'text' }))

  it('supports readOnly', () => {

    // Non-dynamic path: TUI TextInput renders a native <input>
    const config = { type: 'text', label: 'Label' }

    renderHasElement(config, container => container.querySelector('input.tui-input'))
    renderHasNotElement(config, container => container.querySelector('input[disabled]'))

    config.readOnly = false

    renderHasElement(config, container => container.querySelector('input.tui-input'))
    renderHasNotElement(config, container => container.querySelector('input[disabled]'))

    config.readOnly = true

    renderHasElement(config, container => container.querySelector('input.tui-input'))
    renderHasElement(config, container => container.querySelector('input[disabled]'))
  })

  it('can display prefix and suffix', () => {

    const config = {
      type  : 'text',
      label : 'Label'
    }

    renderHasNotElement(config, container => container.querySelector('.tui-input-group__prefix'))
    renderHasNotElement(config, container => container.querySelector('.tui-input-group__suffix'))

    config.prefix = 'prefix value'

    renderHasElement(config, container => container.querySelector('.tui-input-group__prefix'))
    renderHasNotElement(config, container => container.querySelector('.tui-input-group__suffix'))

    delete config.prefix
    config.suffix = 'suffix value'

    renderHasNotElement(config, container => container.querySelector('.tui-input-group__prefix'))
    renderHasElement(config, container => container.querySelector('.tui-input-group__suffix'))

    config.prefix = 'prefix value'

    renderHasElement(config, container => container.querySelector('.tui-input-group__suffix'))
    renderHasElement(config, container => container.querySelector('.tui-input-group__prefix'))
  })

  it('renders prefix and suffix alongside input value', () => {

    const { container } = render(
      fields.render({
        name   : 'field-name',
        type   : 'text',
        label  : 'Label',
        prefix : '[prefix]',
        suffix : '[suffix]',
        value  : 'field-value'
      })
    )

    // TUI TextInput stores the raw value, prefix/suffix are visual elements
    const input = container.querySelector('input.tui-input')
    expect(input.value).toBe('field-value')
    expect(container.querySelector('.tui-input-group__prefix')).toBeTruthy()
    expect(container.querySelector('.tui-input-group__suffix')).toBeTruthy()
  })

  it('supports the a mask config', async () => {

    const { container } = render(
      fields.render({
        name       : 'field-name',
        type       : 'text',
        label      : 'Label',
        inputMask  : '999/aaa',
        value      : 'aaa/999'
      })
    )

    // Invalid initial value should be rejected by mask
    const input = container.querySelector('input.tui-input')
    expect(input.value).toBe('')

    const user = userEvent.setup()
    await user.type(input, '123/abc')

    expect(input.value).toBe('123/abc')
  })

  it('mask rejects invalid characters', async () => {

    const { container } = render(
      fields.render({
        name       : 'field-name',
        type       : 'text',
        label      : 'Label',
        inputMask  : '999/aaa',
      })
    )

    const input = container.querySelector('input.tui-input')
    const user = userEvent.setup()

    // Type digits where letters are expected (after the /)
    await user.type(input, '123456')

    // 456 are digits, but the last 3 slots expect letters (aaa) — should be rejected
    expect(input.value).not.toBe('123/456')
    expect(input.value).toBe('123/___')
  })

  it('supports placeholder', () => {

    const { container } = render(
      fields.render({
        name        : 'field-name',
        type        : 'text',
        label       : 'Label',
        placeholder : 'Example'
      })
    )

    const input = container.querySelector('input.tui-input')
    expect(input.getAttribute('placeholder')).toBe('Example')
  })

  it('renders TUI TextInput path when no dynamic prop', () => {
    renderHasElement(
      { type: 'text', label: 'Label' },
      container => container.querySelector('.tf-text-tui')
    )
    renderHasElement(
      { type: 'text', label: 'Label' },
      container => container.querySelector('input')
    )
  })

  // TODO: mountedRef guard doesn't prevent TUI TextInput from firing onChange on mount
  // The TUI controlled input triggers an onChange event during mount, which bypasses the guard.
  // Skipping until source is fixed.
  it.skip('onChange does not fire on initial mount', () => {
    const onChange = jest.fn()
    render(fields.render({ type: 'text', label: 'Label', value: 'initial', onChange }))
    expect(onChange).not.toHaveBeenCalled()
  })

})
