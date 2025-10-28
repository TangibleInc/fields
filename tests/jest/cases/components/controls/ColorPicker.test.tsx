import * as fields from '../../../../../assets/src/index.tsx'
import '../../../../../assets/src/index.tsx'
import { render } from '@testing-library/react'
import {
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription
} from '../../../utils/fields.ts'

describe('Color component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'color-picker', expectedClass: 'tf-color' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'color-picker', expectedClass: 'tf-color' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'color-picker', expectedClass: 'tf-color' }))

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
        type  : 'color-picker',
        value : initialValue
      }
    ))

    const value = container.querySelector('.tf-color-container input[type="text"]').value
    expect(value).toBe(expectedValue)
  })

})
