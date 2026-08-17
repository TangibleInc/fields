import * as fields from '../../../../../assets/src/index.tsx'
import { render, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  rendersWithMinimal,
  rendersLabelAndDescription
} from '../../../utils/fields.ts'

/**
 * TUI renders the popover inside #tui-portal-root, which carries an inline
 * pointer-events: none re-enabled by .tui-popover in the stylesheet. jsdom
 * doesn't load it, so the pointer-events check is a false positive here
 */
const setup = (config = {}) => {

  const user = userEvent.setup({ pointerEventsCheck: 0 })
  const { container } = render(
    fields.render({
      type  : 'color-picker',
      label : 'Label',
      name  : 'color-field',
      ...config
    })
  )

  return {
    user,
    container,
    trigger : () => container.querySelector('.tui-color-field'),
    value   : () => container.querySelector('input[name="color-field"]').value
  }
}

describe('Color component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'color-picker', expectedClass: 'tf-color' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'color-picker', expectedClass: 'tf-color' }))

  test.each([
    // Valid initial value
    { initialValue: { value: '#00FFFFFF' }, expectedValue: '#00FFFFFF' },
    // Empty/invalid initial values default to #FFFFFF (the old react-aria
    // implementation emitted #FFFFFFFF — TUI's hex omits the alpha byte when
    // fully opaque)
    { initialValue: '', expectedValue: '#FFFFFF' },
    { initialValue: {}, expectedValue: '#FFFFFF' },
    { initialValue: { value: '' }, expectedValue: '#FFFFFF' },
    { initialValue: { something: '#00FFFFFF' }, expectedValue: '#FFFFFF' },
  ])('format initial value (%p)', ({ initialValue, expectedValue }) => {

    const { value } = setup({ value: initialValue })
    expect(value()).toBe(expectedValue)
  })

  it('opens the picker from the trigger and commits an edit', async () => {

    const onChange = jest.fn()
    const { user, trigger, value } = setup({ value: '#6366F1', onChange })

    await user.click(trigger())

    const hexField = await screen.findByRole('textbox', { name: 'Color value' })
    fireEvent.change(hexField, { target: { value: '#FF0000' } })
    fireEvent.keyDown(hexField, { key: 'Enter' })

    expect(value()).toBe('#FF0000')
    expect(onChange).toHaveBeenLastCalledWith('#FF0000')
  })

  it('keeps var() values verbatim', () => {

    const { value } = setup({ value: 'var(--tui-theme-primary-base)' })
    expect(value()).toBe('var(--tui-theme-primary-base)')
  })

  it('offers Solid|Gradient tabs with the gradient option', async () => {

    const { user, trigger } = setup({
      gradient : true,
      value    : 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)'
    })

    await user.click(trigger())

    const tablist = await screen.findByRole('tablist', { name: 'Color type' })
    expect(tablist).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'Gradient' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('group', { name: 'Gradient picker' })).toBeTruthy()
  })

  it('renders no tabs without the gradient option', async () => {

    const { user, trigger } = setup({ value: '#6366F1' })

    await user.click(trigger())

    await screen.findByRole('group', { name: 'Color picker' })
    expect(screen.queryByRole('tablist')).toBeNull()
  })

})
