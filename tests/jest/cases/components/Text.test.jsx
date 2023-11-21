import '../../../../assets/src/index.jsx'
import { 
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription,
  renderHasElement,
  renderHasNotElement
} from '../../utils/fields.js'

const fields = window.tangibleFields

describe('Text component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'text' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'text' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'text' }))
  
  it('supports readOnly', () => {

    const config = { type: 'text', label: 'Label' }

    renderHasElement(config, container => container.querySelector('.cm-content'))
    renderHasElement(config, container => container.querySelector('.cm-content[contenteditable="true"]'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="false"]'))

    config.readOnly = false

    renderHasElement(config, container => container.querySelector('.cm-content'))
    renderHasElement(config, container => container.querySelector('.cm-content[contenteditable="true"]'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="false"]'))

    config.readOnly = true

    renderHasElement(config, container => container.querySelector('.cm-content'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="true"]'))
    renderHasElement(config, container => container.querySelector('.cm-content[contenteditable="false"]'))
  })

})
