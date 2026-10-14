import * as fields from '../../../../../assets/src/index.tsx'
import { commonRepeaterTests } from './common.ts'
import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Repeater with a tab layout', () => {

  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('tab', {
    addText       : '+ Add Item',
    removeElement : async (index, args, config) => {
      await args.user.click(within(args.itemsContainer).getByText('Item ' + (index + 1)))
      await args.user.click(
        within(args.document.querySelector('.tf-repeater-tab-actions'))
          .getByRole('button', { name: new RegExp(`^${config.removeText}( item \\d+)?$`) })
      )
    }
  })

  describe('active tab after removal', () => {

    const setup = (count = 3) => {
      const user = userEvent.setup()
      const { container } = render(
        fields.render({
          type   : 'repeater',
          layout : 'tab',
          name   : 'tab-removal',
          value  : JSON.stringify(
            Array.from({ length: count }, (_, i) => ({ key: `k${i}`, text: `T${i + 1}` }))
          ),
          fields : [{ type: 'text', label: 'Text', name: 'text' }]
        })
      )
      const tabs = () => container.querySelectorAll('[role="tab"]')
      const selected = () => container.querySelector('[role="tab"][aria-selected="true"]')?.textContent
      const remove = async () => {
        await user.click(
          within(container.querySelector('.tf-repeater-tab-actions')).getByRole('button', { name: /^Remove item \d+$/ })
        )
        await user.click(within(document.querySelector('.tf-confirm-dialog')).getByText('Remove'))
      }
      return { user, container, tabs, selected, remove }
    }

    it('selects the next item after removing a middle one', async () => {
      const { user, tabs, selected, remove } = setup()
      await user.click(tabs()[1])
      expect(selected()).toBe('Item 2')
      await remove()
      expect(tabs().length).toBe(2)
      // the former third item is now second, and selected
      expect(selected()).toBe('Item 2')
      expect(within(document.body).getByDisplayValue('T3')).toBeTruthy()
    })

    it('selects the previous item after removing the last one', async () => {
      const { user, tabs, selected, remove } = setup()
      await user.click(tabs()[2])
      await remove()
      expect(tabs().length).toBe(2)
      expect(selected()).toBe('Item 2')
      expect(within(document.body).getByDisplayValue('T2')).toBeTruthy()
    })

    it('names the tablist after the field label', () => {
      const { container } = render(
        fields.render({
          type   : 'repeater',
          layout : 'tab',
          label  : 'Speakers',
          fields : [{ type: 'text', label: 'Text', name: 'text' }]
        })
      )
      expect(within(container).getByRole('tablist').getAttribute('aria-label')).toBe('Speakers items')
    })

    it('keeps focus on the Remove trigger after removing the active item', async () => {
      const { tabs, remove, container } = setup()
      await remove()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(tabs().length).toBe(2)
      expect(document.activeElement).toBe(
        within(container.querySelector('.tf-repeater-tab-actions')).getByRole('button', { name: /^Remove item/ })
      )
    })

    it('hides the item actions once the list is empty', async () => {
      const { container, tabs, remove } = setup(1)
      await remove()
      expect(tabs().length).toBe(0)
      expect(container.querySelector('.tf-repeater-tab-icon-actions')).toBeNull()
      expect(within(container).getByText('+ Add Item')).toBeTruthy()
    })
  })
})
