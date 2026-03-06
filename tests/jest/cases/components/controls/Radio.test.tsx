import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup } from '../../../../../assets/src/components/field/radio/RadioGroup'
import Radio from '../../../../../assets/src/components/field/radio/Radio'

describe('RadioGroup TUI path', () => {

  it('renders .tf-radio-group wrapper', () => {
    const { container } = render(
      <RadioGroup label="Choose" onChange={jest.fn()}>
        <Radio value="a">Option A</Radio>
      </RadioGroup>
    )
    expect(container.querySelector('.tf-radio-group')).toBeTruthy()
  })

  it('renders radio options', () => {
    render(
      <RadioGroup label="Choose" onChange={jest.fn()}>
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    )
    expect(screen.getByText('Option A')).toBeTruthy()
    expect(screen.getByText('Option B')).toBeTruthy()
  })

  it('onChange does not fire on mount', () => {
    const onChange = jest.fn()
    render(
      <RadioGroup label="Choose" value="a" onChange={onChange}>
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  it('fires onChange when a radio is selected', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const { container } = render(
      <RadioGroup label="Choose" value="a" onChange={onChange}>
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    )
    const radios = container.querySelectorAll('[role="radio"]')
    await user.click(radios[1])
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('disabled state disables radio buttons', () => {
    const { container } = render(
      <RadioGroup label="Choose" isDisabled onChange={jest.fn()}>
        <Radio value="a">Option A</Radio>
      </RadioGroup>
    )
    const radioBtn = container.querySelector('[role="radio"]') as HTMLButtonElement
    expect(radioBtn.disabled).toBe(true)
  })
})
