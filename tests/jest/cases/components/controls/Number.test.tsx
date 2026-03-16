import * as fields from '../../../../../assets/src/index.tsx'
import {
  render,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription,
  renderHasElement,
  renderHasNotElement
} from '../../../utils/fields.ts'

describe('Number component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'number' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'number' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'number' }))

  it('takes into account hasButton', () => {

    const config = { type: 'number', label: 'Label' }

    renderHasElement(config, container => within(container).getByText('+'))
    renderHasElement(config, container => within(container).getByText('-'))

    renderHasElement({ ...config, hasButtons: true }, container => within(container).getByText('+'))
    renderHasElement({ ...config, hasButtons: true }, container => within(container).getByText('-'))

    renderHasNotElement({ ...config, hasButtons: false }, container => within(container).queryByText('+'))
    renderHasNotElement({ ...config, hasButtons: false }, container => within(container).queryByText('-'))
  })

  test.each([
    { props: {},                   result: false },
    { props: { readOnly : true },  result: true },
    { props: { readOnly : false }, result: false }
  ])('supports readOnly (%p)', async args => {

    const { container } = render(
      fields.render({
        name     : 'field-name',
        type     : 'number',
        label    : 'Label',
        ...args.props
      })
    )

    const input = container.querySelector('.tf-number').querySelector('input')
    expect( input.hasAttribute('disabled') ).toBe(args.result)

    expect( within(container).getByText('+').hasAttribute('disabled') ).toBe(args.result)
    expect( within(container).getByText('-').hasAttribute('disabled') ).toBe(args.result)
  })

  test.each([
    { value: 3.14,   expected: '3.14' },
    { value: '3.14', expected: '3.14' },
  ])('accepts a decimal value as initial prop ($value)', ({ value, expected }) => {

    const { container } = render(
      fields.render({
        name  : 'field-name',
        type  : 'number',
        label : 'Label',
        value : value
      })
    )

    const input = container.querySelector('.tf-number input')
    expect( input.value ).toBe(expected)
  })

  test.each([
    { value: 0.5,   expected: '0.5' },
    { value: '0.5', expected: '0.5' },
  ])('does not collapse decimal values to 0 ($value)', ({ value, expected }) => {

    const { container } = render(
      fields.render({
        name  : 'field-name',
        type  : 'number',
        label : 'Label',
        value : value
      })
    )

    const input = container.querySelector('.tf-number input')
    expect( input.value ).toBe(expected)
  })

  it('accepts a decimal input typed by the user', async () => {

    const user = userEvent.setup()

    const { container } = render(
      fields.render({
        name  : 'field-name',
        type  : 'number',
        label : 'Label',
      })
    )

    const input = container.querySelector('.tf-number input')

    await user.clear(input)
    await user.type(input, '2.75')

    expect( input.value ).toBe('2.75')
  })

  it('increments by step value when clicking +', async () => {

    const user = userEvent.setup()

    const { container } = render(
      fields.render({
        name  : 'field-name',
        type  : 'number',
        label : 'Label',
        value : 1,
        step  : 0.5
      })
    )

    const input = container.querySelector('.tf-number input')
    const incrementButton = within(container).getByText('+')

    expect( input.value ).toBe('1')

    await user.click(incrementButton)
    expect( input.value ).toBe('1.5')

    await user.click(incrementButton)
    expect( input.value ).toBe('2')
  })

  it('increments by 1 when step is not specified', async () => {

    const user = userEvent.setup()

    const { container } = render(
      fields.render({
        name  : 'field-name',
        type  : 'number',
        label : 'Label',
        value : 3,
      })
    )

    const input = container.querySelector('.tf-number input')
    const incrementButton = within(container).getByText('+')

    await user.click(incrementButton)
    expect( input.value ).toBe('4')
  })

  test.each([
    { value: 3.14159,   expected: '3.14' },
    { value: '3.14159', expected: '3.14' },
  ])('truncates decimals when formatOptions limits fraction digits ($value)', ({ value, expected }) => {

    const { container } = render(
      fields.render({
        name          : 'field-name',
        type          : 'number',
        label         : 'Label',
        value         : value,
        formatOptions : { maximumFractionDigits: 2, useGrouping: false }
      })
    )

    const input = container.querySelector('.tf-number input')
    expect( input.value ).toBe(expected)
  })

})
