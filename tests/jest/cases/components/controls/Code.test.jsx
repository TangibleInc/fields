import '../../../../../assets/src/index.jsx'
import {
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription
} from '../../../utils/fields.js'

describe('Code component', () => {
  it('renders with minimal config', () => rendersWithMinimal({ type: 'code' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'code' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'code' }))
})
