import * as fields from '../../../../../assets/src/index.tsx'
import { commonRepeaterTests } from './common.ts'
import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Repeater with a bare layout', () => {

  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('bare')

  const setup = (extra = {}) => {
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : 'bare',
        name   : 'bare-test',
        value  : JSON.stringify([{ key: 'a', text: 'A' }, { key: 'b', text: 'B' }]),
        fields : [{ type: 'text', label: 'Text', name: 'text' }],
        ...extra
      })
    )
    return { user, container }
  }

  it('renders an icon Remove per row, named for the row', () => {
    const { container } = setup()
    const rows = container.querySelectorAll('.tf-repeater-bare-row')
    expect(within(rows[1]).getByRole('button', { name: 'Remove item 2' })).toBeTruthy()
    expect(container.querySelectorAll('.tui-move-handle').length).toBe(0)
  })

  it('renders no row actions when not repeatable', () => {
    const { container } = setup({ repeatable: false })
    expect(container.querySelector('.tf-repeater-bare-row-actions')).toBeNull()
    expect(within(container).queryAllByRole('button').length).toBe(0)
  })

  it('leads each row with a move handle when sortable', async () => {
    const { user, container } = setup({ sortable: true })
    const rows = container.querySelectorAll('.tf-repeater-bare-row')
    expect(rows[0].firstElementChild.classList.contains('tui-move-handle')).toBe(true)

    await user.click(within(rows[0]).getByLabelText('Move item 1 down'))
    const saved = JSON.parse(container.querySelector('input[name=bare-test]').getAttribute('value'))
    expect(saved.map(row => row.text)).toEqual(['B', 'A'])
  })
})
