import '@testing-library/jest-dom'
import { render, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmTrigger } from '../../../../assets/src/components/base'

const dialog = () => document.querySelector('.tf-confirm-dialog') as HTMLElement | null
const wrappers = () => document.querySelectorAll('body > .tf-interface').length

const setup = ({ label = 'Remove', ...props }: Record<string, any> = {}) => {
  const onConfirm = jest.fn()
  const onCancel = jest.fn()
  const user = userEvent.setup()
  const utils = render(
    <ConfirmTrigger
      label={ label }
      title="Remove this item?"
      onConfirm={ onConfirm }
      onCancel={ onCancel }
      { ...props }
    >
      Item 2 will be removed.
    </ConfirmTrigger>
  )
  const trigger = within(utils.container).getByText(label)
  return { ...utils, user, trigger, onConfirm, onCancel }
}

describe('ConfirmDialog', () => {

  it('names and describes the dialog from its title and body', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)

    const el = dialog()
    expect(el).toBeTruthy()
    expect(el.getAttribute('role')).toBe('alertdialog')

    const title = document.getElementById(el.getAttribute('aria-labelledby'))
    const body = document.getElementById(el.getAttribute('aria-describedby'))
    expect(title).toHaveTextContent('Remove this item?')
    expect(body).toHaveTextContent('Item 2 will be removed.')
  })

  it('moves initial focus to Cancel', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    await waitFor(() =>
      expect(document.activeElement).toBe(within(dialog()).getByText('Cancel'))
    )
  })

  it('cancels and restores focus to the trigger', async () => {
    const { user, trigger, onConfirm, onCancel } = setup()
    await user.click(trigger)
    await user.click(within(dialog()).getByText('Cancel'))

    expect(dialog()).toBeFalsy()
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  })

  it('confirms with the trigger label by default', async () => {
    const { user, trigger, onConfirm, onCancel } = setup()
    await user.click(trigger)
    // Title is "Remove this item?", so the exact match is the confirm button
    await user.click(within(dialog()).getByText('Remove'))

    expect(dialog()).toBeFalsy()
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  })

  it('treats Escape as cancel', async () => {
    const { user, trigger, onConfirm, onCancel } = setup()
    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(dialog()).toBeFalsy()
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('uses confirmText when given', async () => {
    const { user, trigger } = setup({ label: 'Apply', confirmText: 'Delete' })
    await user.click(trigger)
    expect(within(dialog()).getByText('Delete')).toBeTruthy()
    expect(within(dialog()).queryByText('Apply')).toBeFalsy()
  })

  it('keeps one portal wrapper per trigger and removes it on unmount', async () => {
    const before = wrappers()
    const { user, trigger, unmount } = setup()

    expect(wrappers()).toBe(before)
    await user.click(trigger)
    expect(wrappers()).toBe(before + 1)
    await user.click(within(dialog()).getByText('Cancel'))
    await user.click(trigger)
    await user.click(within(dialog()).getByText('Cancel'))
    expect(wrappers()).toBe(before + 1)

    unmount()
    expect(wrappers()).toBe(before)
  })
})
