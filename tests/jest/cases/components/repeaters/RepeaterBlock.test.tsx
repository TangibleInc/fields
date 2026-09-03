import * as fields from '../../../../../assets/src/index.tsx'
import { commonRepeaterTests } from './common.ts'
import { bulkActionsRepeaterTests } from './bulkActions.ts'
import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Repeater with a block layout', () => {
  
  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('block')

  /**
   * Common tests for the bulk actions (shared with advanced layout)
   */
  bulkActionsRepeaterTests('block')

  describe('accordion rows', () => {

    const setup = (extra = {}) => {
      const user = userEvent.setup()
      const { container } = render(
        fields.render({
          type   : 'repeater',
          layout : 'block',
          name   : 'block-accordion',
          value  : JSON.stringify([
            { key: 'a', text: 'A' },
            { key: 'b', text: 'B' },
            { key: 'c', text: 'C' }
          ]),
          fields : [{ type: 'text', label: 'Text', name: 'text' }],
          ...extra
        })
      )
      const rows = () => container.querySelectorAll('.tf-repeater-block-item')
      const triggers = () => container.querySelectorAll('.tf-panel-header-trigger')
      return { user, container, rows, triggers }
    }

    it('opens the first row by default and renders only its fields', () => {
      const { rows, triggers, container } = setup()
      expect(rows().length).toBe(3)
      expect(rows()[0].getAttribute('data-state')).toBe('open')
      expect(triggers()[0].tagName).toBe('BUTTON')
      expect(triggers()[0].getAttribute('aria-expanded')).toBe('true')
      expect(triggers()[1].getAttribute('aria-expanded')).toBe('false')
      expect(within(container).getByDisplayValue('A')).toBeTruthy()
      expect(within(container).queryByDisplayValue('B')).toBeNull()
    })

    it('toggles from the title trigger, the header row, and the footer link', async () => {
      const { user, rows, triggers, container } = setup()

      await user.click(triggers()[1])
      expect(rows()[1].getAttribute('data-state')).toBe('open')
      expect(rows()[0].getAttribute('data-state')).toBe('closed')
      expect(within(container).getByDisplayValue('B')).toBeTruthy()

      await user.click(rows()[2].querySelector('.tf-panel-header'))
      expect(rows()[2].getAttribute('data-state')).toBe('open')

      const link = within(rows()[2]).getByText('Close')
      expect(link.getAttribute('aria-expanded')).toBe('true')
      expect(document.getElementById(link.getAttribute('aria-controls'))).toBeTruthy()
      await user.click(link)
      expect(rows()[2].getAttribute('data-state')).toBe('closed')
      expect(within(container).queryByRole('textbox')).toBeNull()
    })

    it('does not toggle when the bulk checkbox or switch in the header is used', async () => {
      const { user, rows } = setup({ useBulk: true, useSwitch: true })
      expect(rows()[1].getAttribute('data-state')).toBe('closed')

      const header = rows()[1].querySelector('.tf-panel-header')
      await user.click(within(header).getByLabelText('Select item 2'))
      expect(rows()[1].getAttribute('data-state')).toBe('closed')

      await user.click(within(header).getByLabelText('Enable item 2'))
      expect(rows()[1].getAttribute('data-state')).toBe('closed')
    })

    it('keeps the open row when a row above it is removed', async () => {
      const { user, rows, triggers, container } = setup()
      await user.click(triggers()[1])

      await user.click(within(rows()[0]).getByText('Remove'))
      await user.click(within(document.querySelector('.tf-confirm-dialog')).getByText('Remove'))

      expect(rows().length).toBe(2)
      expect(rows()[0].getAttribute('data-state')).toBe('open')
      expect(within(container).getByDisplayValue('B')).toBeTruthy()
    })

    it('shows a move handle in the header when sortable', async () => {
      const { user, rows, container } = setup({ sortable: true })
      const header = rows()[0].querySelector('.tf-panel-header')
      expect(within(header).getByLabelText('Reorder item 1')).toBeTruthy()

      await user.click(within(header).getByLabelText('Move item 1 down'))
      const saved = JSON.parse(container.querySelector('input[name=block-accordion]').getAttribute('value'))
      expect(saved.map(row => row.text)).toEqual(['B', 'A', 'C'])
    })
  })
})
