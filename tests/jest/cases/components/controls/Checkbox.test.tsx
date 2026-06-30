import * as fields from '../../../../../assets/src/index.tsx'
import userEvent from '@testing-library/user-event'
import {
  render,
  within
} from '@testing-library/react'
import {
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription
} from '../../../utils/fields.ts'
import Checkbox from '../../../../../assets/src/components/field/checkbox/Checkbox'

describe('Checkbox component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'checkbox' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'checkbox' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'checkbox' }))

  it('triggers checked change if label is clicked', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        label   : 'Click on label',
        name    : 'checkbox-name',
        type    : 'checkbox',
      })
    )

    const input = container.querySelector('input[type="checkbox"]')
    expect(input.checked).toBe(false)

    await user.click(within(container).getByText('Click on label'))

    expect(input.checked).toBe(true)
  })
})

describe('Checkbox TUI path', () => {

  it('renders TUI checkbox input', () => {
    const { container } = render(<Checkbox label="Label" />)
    expect(container.querySelector('input[type="checkbox"]')).toBeTruthy()
  })

  it('onChange does not fire on mount', () => {
    const onChange = jest.fn()
    render(<Checkbox label="Label" value={false} onChange={onChange} />)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('controlled value updates reflect in checkbox state', () => {
    const { container, rerender } = render(<Checkbox label="Label" value={false} />)
    const input = container.querySelector('input[type="checkbox"]')
    expect(input.checked).toBe(false)
    rerender(<Checkbox label="Label" value={true} />)
    expect(input.checked).toBe(true)
  })

  it('disabled state passes through', () => {
    const { container } = render(<Checkbox label="Label" isDisabled />)
    const input = container.querySelector('input[type="checkbox"]')
    expect(input.disabled).toBe(true)
  })
})
