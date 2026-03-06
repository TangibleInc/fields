import { render } from '@testing-library/react'
import * as fields from '../../../../../assets/src/index.tsx'
import {
  rendersWithMinimal,
  rendersLabelAndDescription
} from '../../../utils/fields.ts'

describe('Textarea component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'textarea', expectedClass: 'tf-text-area' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'textarea', expectedClass: 'tf-text-area' }))

  it('renders TUI textarea element', () => {
    const { container } = render(fields.render({ type: 'textarea', label: 'Notes' }))
    expect(container.querySelector('textarea')).toBeTruthy()
  })

  it('renders .tf-text-area wrapper', () => {
    const { container } = render(fields.render({ type: 'textarea', label: 'Notes' }))
    expect(container.querySelector('.tf-text-area')).toBeTruthy()
  })

  it('controlled value is reflected in textarea', () => {
    const { container } = render(
      fields.render({ type: 'textarea', label: 'Notes', name: 'notes', value: 'hello' })
    )
    const textarea = container.querySelector('textarea')
    expect(textarea.value).toBe('hello')
  })

  it('readOnly renders a read-only textarea', () => {
    const { container } = render(
      fields.render({ type: 'textarea', label: 'Notes', readOnly: true })
    )
    const textarea = container.querySelector('textarea')
    expect(textarea.readOnly).toBe(true)
  })
})
