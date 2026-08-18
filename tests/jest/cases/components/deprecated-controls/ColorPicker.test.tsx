import * as fields from '../../../../../assets/src/index.tsx'
import '../../../../../assets/src/index.tsx'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription
} from '../../../utils/fields.ts'

describe('Color component (deprecated)', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'deprecated-color-picker', expectedClass: 'tf-color' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'deprecated-color-picker', expectedClass: 'tf-color' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'deprecated-color-picker', expectedClass: 'tf-color' }))

  test.each([
    // Valid initial value
    { initialValue: { value: '#00FFFFFF' }, expectedValue: '#00FFFFFF' },
    // Invalid initial value, will default to #FFFFFFFF 
    { initialValue: '', expectedValue: '#FFFFFFFF' },
    { initialValue: {}, expectedValue: '#FFFFFFFF' },
    { initialValue: { value: '' }, expectedValue: '#FFFFFFFF' },
    { initialValue: { something: '#00FFFFFF' }, expectedValue: '#FFFFFFFF' },
  ])('format initial value (%p)', ({ initialValue, expectedValue }) => {

    const { container } = render(
      fields.render({
        type  : 'deprecated-color-picker',
        value : initialValue
      }
    ))

    const value = container.querySelector('.tf-color-container input[type="text"]').value
    expect(value).toBe(expectedValue)
  })

  /**
   * The picker is rendered in a portal, outside of the field container, so it
   * needs its own .tf-deprecated-control class to get the deprecated style
   */
  it('renders the picker inside a deprecated container', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type  : 'deprecated-color-picker',
        label : 'Label for color_picker'
      }
    ))

    await user.click(container.querySelector('.tf-color-container input[type="text"]'))

    const picker = document.querySelector('.tf-color-picker')

    expect(picker).toBeTruthy()
    expect(picker.closest('.tf-deprecated-control')).toBeTruthy()
  })

})
