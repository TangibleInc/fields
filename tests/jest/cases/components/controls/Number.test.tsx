import * as fields from '../../../../../assets/src/index.tsx'
import { 
  render, 
  within 
} from '@testing-library/react'
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

})
