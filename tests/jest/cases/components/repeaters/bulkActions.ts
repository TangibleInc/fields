import '@testing-library/jest-dom'
import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as fields from '../../../../../assets/src/index.tsx'

/**
 * Run common tests for bulk actions (currently advanced and block layout only)
 */
const bulkActionsRepeaterTests = (layout, args = {}) => {

  const config = {
    addText: 'Add item',
    cloneText: 'Clone',
    removeText: 'Remove',
    removeElement: false,
    ...args
  }

  test.each([
    { config: {}, result: false },
    { config: { useBulk: false }, result: false },
    { config: { useBulk: true }, result: true },
  ])(
    'contains the bulkActions component according to useBulk value (%p)',
    ({ config, result }) => {

      const { container } = render(
        fields.render({
          type   : 'repeater',
          layout : layout,
          fields : [],
          ...config
        })
      )

      result === true
        ? expect(container.querySelector(`.tf-repeater-bulk-actions`)).toBeTruthy()
        : expect(container.querySelector(`.tf-repeater-bulk-actions`)).toBeFalsy()
  })

  it('can bulk delete repeater items', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type    : 'repeater',
        layout  : layout,
        fields  : [],
        useBulk : true,
        value   : [{}, {}, {}, {}]
      })
    )

    expect(
      container.querySelectorAll(`.tf-repeater-${layout}-item`).length
    ).toBe(4)

    let activeItems = []
    const bulkCheckbox = container.querySelector(`.tf-repeater-bulk-actions input[type='checkbox']`)

    activeItems = container.querySelectorAll(
      `.tf-repeater-${layout}-item input[type='checkbox']:checked`
    )
    expect(activeItems.length).toBe(0)

    await user.click(bulkCheckbox)

    activeItems = container.querySelectorAll(
      `.tf-repeater-${layout}-item input[type='checkbox']:checked`
    )
    expect(activeItems.length).toBe(4)

    // open select, chose delete action, click apply, confirm modal
    const bulkActionContainer = container.querySelector('.tf-repeater-bulk-actions')
    await user.click(within(bulkActionContainer).getByText('▼'))
    await user.click(
      within(document.querySelector('.tf-popover ')).getByText('Delete')
    )
    await user.click(within(bulkActionContainer).getByText('Apply'))
    await user.click(
      within(document.querySelector('.tf-modal-container')).getByText('Apply')
    )

    expect(
      container.querySelectorAll(`.tf-repeater-${layout}-item`).length
    ).toBe(0)
  })
}

export { bulkActionsRepeaterTests }
