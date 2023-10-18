import '../../../../assets/src/index.jsx'
import { within } from '@testing-library/react'
import { 
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription,
  renderHasElement,
  renderHasNotElement
} from '../../utils/fields.js'

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
})
