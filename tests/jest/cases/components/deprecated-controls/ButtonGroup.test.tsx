import * as fields from '../../../../../assets/src/index.tsx'
import { render } from '@testing-library/react'
import {
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription,
  renderHasElement,
  renderHasNotElement
} from '../../../utils/fields.ts'

describe('Deprecated button group component', () => {

  const type = 'deprecated-button-group'
  const expectedClass = 'tf-button-group'

  it('renders with minimal config', () => rendersWithMinimal({ type, expectedClass }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type, expectedClass }))
  it('renders label and description', () => rendersLabelAndDescription({ type, expectedClass }))

  it('renders', () => {

      render(
        <>
          { fields.render({
            label   : 'Button group',
            name    : 'button-group-name',
            type    : type,
            choices : {
              choice1 : 'Choice 1',
              choice2 : 'Choice 2'
            }
          }) }
        </>
      )

      const select = document.getElementsByClassName('tf-button-group')
      expect(select.length).toBe(1)

      const items = select[0].getElementsByClassName('tf-button-group-option')
      expect(items.length).toBe(2)

  })

  it('supports readOnly', () => {

    const config = {
      label   : 'Button group',
      type    : type,
      choices : {
        choice1 : 'Choice 1',
        choice2 : 'Choice 2'
      },
    }

    renderHasElement(config, container => container.querySelector('.tf-button-group-container'))
    renderHasNotElement(config, container => container.querySelector('.tf-button-group-container[aria-disabled]'))

    config.isDisabled = false

    renderHasElement(config, container => container.querySelector('.tf-button-group-container'))
    renderHasNotElement(config, container => container.querySelector('.tf-button-group-container[aria-disabled]'))

    config.isDisabled = true

    renderHasElement(config, container => container.querySelector('.tf-button-group-container'))
    renderHasElement(config, container => container.querySelector('.tf-button-group-container[aria-disabled]'))

  })

})
