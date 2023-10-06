import '../../../../assets/src/index.jsx'
import { 
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription 
} from '../../utils/fields.js'

describe('Text component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'text' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'text' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'text' }))

})
