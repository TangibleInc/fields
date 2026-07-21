import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Switch from '../../../../../assets/src/components/field/switch/Switch'

describe('Switch TUI path', () => {

  it('renders .tf-switch wrapper', () => {
    const { container } = render(<Switch label="Toggle" />)
    expect(container.querySelector('.tf-switch')).toBeTruthy()
  })

  it('renders TUI switch button', () => {
    const { container } = render(<Switch label="Toggle" />)
    expect(container.querySelector('[role="switch"]')).toBeTruthy()
  })

  it('onChange does not fire on mount', () => {
    const onChange = jest.fn()
    render(<Switch label="Toggle" value={false} onChange={onChange} />)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('controlled value updates reflect in aria-checked', () => {
    const { container, rerender } = render(<Switch label="Toggle" value={false} />)
    const btn = container.querySelector('[role="switch"]')
    expect(btn.getAttribute('aria-checked')).toBe('false')
    rerender(<Switch label="Toggle" value={true} />)
    expect(btn.getAttribute('aria-checked')).toBe('true')
  })

  it('disabled state passes through', () => {
    const { container } = render(<Switch label="Toggle" isDisabled />)
    const btn = container.querySelector('[role="switch"]') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('fires onChange when toggled by user', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const { container } = render(<Switch label="Toggle" value={false} onChange={onChange} />)
    await user.click(container.querySelector('[role="switch"]'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
