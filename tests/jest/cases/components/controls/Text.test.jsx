import * as fields from '../../../../../assets/src/index.jsx'
import { 
  act, 
  render
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { 
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription,
  renderHasElement,
  renderHasNotElement
} from '../../../utils/fields.js'

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

    config.readOnly = false
    config.dynamic = true
    config.value = '[[test-value-no-settings]]'

    renderHasElement(config, container => container.querySelector('.cm-content'))
    renderHasElement(config, container => container.querySelector('.cm-content[contenteditable="true"]'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="false"]'))
    renderHasElement(config, container => container.querySelector('.tf-dynamic-wrapper-insert'))
    renderHasElement(config, container => container.querySelector('.tf-dynamic-text-item'))
    renderHasElement(config, container => container.querySelector('.tf-dynamic-text-item-delete'))

    config.readOnly = true
    config.dynamic = true
    config.value = '[[test-value-no-settings]]'

    renderHasElement(config, container => container.querySelector('.cm-content'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="true"]'))
    renderHasElement(config, container => container.querySelector('.cm-content[contenteditable="false"]'))
    renderHasNotElement(config, container => container.querySelector('.tf-dynamic-wrapper-insert'))
    renderHasElement(config, container => container.querySelector('.tf-dynamic-text-item'))
    renderHasNotElement(config, container => container.querySelector('.tf-dynamic-text-item-delete'))

    config.readOnly = false
    config.dynamic = { mode: 'replace' }
    config.value = ''

    renderHasElement(config, container => container.querySelector('.cm-content'))
    renderHasElement(config, container => container.querySelector('.cm-content[contenteditable="true"]'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="false"]'))
    renderHasElement(config, container => container.querySelector('.tf-dynamic-wrapper-insert'))

    config.readOnly = true
    config.dynamic = { mode: 'replace' }
    config.value = ''

    renderHasElement(config, container => container.querySelector('.cm-content'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="true"]'))
    renderHasElement(config, container => container.querySelector('.cm-content[contenteditable="false"]'))
    renderHasNotElement(config, container => container.querySelector('.tf-dynamic-wrapper-insert'))

    config.readOnly = false
    config.dynamic = { mode: 'replace' }
    config.value = '[[test-value-no-settings]]'

    renderHasNotElement(config, container => container.querySelector('.cm-content'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="true"]'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="false"]'))
    renderHasElement(config, container => container.querySelector('.tf-dynamic-value-input'))
    renderHasElement(config, container => container.querySelector('.tf-dynamic-wrapper-clear'))

    config.readOnly = true
    config.dynamic = { mode: 'replace' }
    config.value = '[[test-value-no-settings]]'

    renderHasNotElement(config, container => container.querySelector('.cm-content'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="true"]'))
    renderHasNotElement(config, container => container.querySelector('.cm-content[contenteditable="false"]'))
    renderHasElement(config, container => container.querySelector('.tf-dynamic-value-input'))
    renderHasNotElement(config, container => container.querySelector('.tf-dynamic-wrapper-clear'))
  })

  it('can display prefix and suffix', () => {

    const config = { 
      type  : 'text', 
      label : 'Label' 
    }

    renderHasNotElement(config, container => container.querySelector('.tf-dynamic-text-input__affix--prefix'))
    renderHasNotElement(config, container => container.querySelector('.tf-dynamic-text-input__affix--suffix'))

    config.prefix = 'prefix value'

    renderHasElement(config, container => container.querySelector('.tf-dynamic-text-input__affix--prefix'))
    renderHasNotElement(config, container => container.querySelector('.tf-dynamic-text-input__affix--suffix'))

    delete config.prefix
    config.suffix = 'suffix value'

    renderHasNotElement(config, container => container.querySelector('.tf-dynamic-text-input__affix--prefix'))
    renderHasElement(config, container => container.querySelector('.tf-dynamic-text-input__affix--suffix'))

    config.prefix = 'prefix value'

    renderHasElement(config, container => container.querySelector('.tf-dynamic-text-input__affix--suffix'))
    renderHasElement(config, container => container.querySelector('.tf-dynamic-text-input__affix--prefix'))
  })

  it('adds the suffix and the prefix in the hidden input', async () => {

    const { container } = render( 
      fields.render({
        name   : 'field-name', 
        type   : 'text', 
        label  : 'Label',
        prefix : '[prefix]',
        suffix : '[suffix]',
        value  : 'field-value' 
      })
    )

    const input = container.querySelector('.tf-text').querySelector('input')
    expect(input.value).toBe('[prefix]field-value[suffix]')
    
    const user = userEvent.setup()
    await user.type(container.querySelector('.cm-line'), 'write something before the value ')
    expect(input.value).toBe('[prefix]write something before the value field-value[suffix]')

    // Should we test/support prefix and suffix when dynamic values are enabled?
  })

  it('supports the a mask config', async () => {

    let input
    const { container } = render( 
      fields.render({
        name       : 'field-name', 
        type       : 'text', 
        label      : 'Label',
        inputMask  : '999/aaa',
        value      : 'aaa/999'
      })
    )

    input = container.querySelector('.tf-text').querySelector('input')
    expect(input.value).toBe('')
    
    act(() => fields.store.setValue('field-name', ''))

    const user = userEvent.setup()

    input = container.querySelector('.tf-text').querySelector('input')
    await user.type(container.querySelector('.cm-line'), '123/abc')
    expect(input.value).toBe('123/abc')
    
    act(() => fields.store.setValue('field-name', ''))
    
    input = container.querySelector('.tf-text').querySelector('input')
    await user.type(container.querySelector('.cm-line'), '123/456')
    expect(input.value).toBe('123/___')
  })

  it('supports placeholder', () => {
    
    const { container } = render( 
      fields.render({
        name       : 'field-name', 
        type       : 'text', 
        label      : 'Label',
        placeholder: 'Example'
      })
    )

    const placeholder = container.querySelector('.cm-placeholder')
    expect(placeholder.innerHTML).toBe('Example')
  })

})
