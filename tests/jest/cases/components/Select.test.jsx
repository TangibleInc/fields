import '../../../../assets/src/index.jsx'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHasElement, renderHasNotElement } from '../../utils/fields.js'

const fields = window.tangibleFields

describe('Select component', () => {

    it('renders', () => {
      
        render( 
            <>
              { fields.render({
                label       : 'Select',
                name        : 'select-name',
                type        : 'select',
                choices     : [
                  {
                    choice1 : 'Choice 1' 
                  },
                  {
                    choice2 : 'Choice 2'
                  },
                ]
              }) }
            </>
        )

        const select = document.getElementsByClassName('tf-select')
        expect(select.length).toBe(1)

        const items = select[0].getElementsByClassName('tf-button-select')
        expect(items.length).toBe(1)

        const currentChoice = items[0].textContent
        expect(currentChoice).toContain('Select an option')

    })

    it('supports readOnly', () => {

      const config = { 
        type    : 'select', 
        label   : 'Label',
        choices : [
            {
              choice1: 'Choice 1' 
            },
            {
              choice2: 'Choice 2'
            },
        ] 
      }

      renderHasElement(config, container => container.querySelector('.tf-button-select'))
      renderHasNotElement(config, container => container.querySelector('.tf-button-select[disabled]'))

      config.isDisabled = false

      renderHasElement(config, container => container.querySelector('.tf-button-select'))
      renderHasNotElement(config, container => container.querySelector('.tf-button-select[disabled]'))

      config.isDisabled = true

      renderHasElement(config, container => container.querySelector('.tf-button-select'))
      renderHasElement(config, container => container.querySelector('.tf-button-select[disabled]'))

    })

})
