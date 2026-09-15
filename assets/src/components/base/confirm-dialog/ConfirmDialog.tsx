import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import { Modal } from '@tangible/ui'

import Button from '../button/Button'
import type { FieldsButtonProps } from '../button/Button'
import usePortalContainer from '../modal/usePortalContainer'

type ConfirmType = 'danger' | 'primary'

/**
 * Also the initialFocusSelector target and a styling hook in index.scss
 */
export const CANCEL_CLASS = 'tf-confirm-dialog__cancel'

export interface ConfirmDialogProps {
  open: boolean
  /** Called when the dialog wants to close, whichever way (confirm, cancel, escape, backdrop). */
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel?: () => void
  title?: ReactNode
  children?: ReactNode
  confirmText?: ReactNode
  cancelText?: ReactNode
  /** Visual weight of the confirm action. Destructive by default — that is what a confirm is for. */
  confirmType?: ConfirmType
  /** Applied to the dialog element, not the trigger (use buttonProps.className for that) */
  className?: string
}

/**
 * Controlled confirmation dialog on top of TUI Modal.
 *
 * Accessibility:
 * - Title and body are wired as the dialog's name and description
 * - Initial focus lands on Cancel — the least destructive action — as
 *   recommended by the WAI-ARIA dialog pattern for destructive confirms
 * - Escape cancels; a backdrop click does nothing, since an alert dialog
 *   asks for an answer (TUI's default for role="alertdialog")
 * - Focus returns to the trigger on close (the Modal stays mounted through
 *   the close so TUI can restore it)
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmType = 'danger',
  className
}: ConfirmDialogProps) => {

  const id = useId()
  const titleId = `tf-confirm-title-${id}`
  const bodyId = `tf-confirm-body-${id}`

  const container = usePortalContainer(open)

  const cancel = () => {
    onOpenChange(false)
    onCancel?.()
  }

  const confirm = () => {
    onOpenChange(false)
    onConfirm()
  }

  if (!container) return null

  return (
    <Modal
      open={open}
      onClose={cancel}
      role="alertdialog"
      size="sm"
      container={container}
      aria-labelledby={titleId}
      aria-describedby={children ? bodyId : undefined}
      initialFocusSelector={`.${CANCEL_CLASS}`}
      closeOnEscape
      className={['tf-confirm-dialog', className].filter(Boolean).join(' ')}
    >
      <Modal.Head>
        <h2 id={titleId} className="tf-confirm-dialog__title">
          {title}
        </h2>
      </Modal.Head>
      {children && (
        <Modal.Body>
          <div id={bodyId} className="tf-confirm-dialog__body">
            {children}
          </div>
        </Modal.Body>
      )}
      <Modal.Foot className="tf-confirm-dialog__actions">
        <Button
          type="action"
          className={CANCEL_CLASS}
          onPress={cancel}
        >
          {cancelText}
        </Button>
        <Button
          type={confirmType}
          className="tf-confirm-dialog__confirm"
          onPress={confirm}
        >
          {confirmText}
        </Button>
      </Modal.Foot>
    </Modal>
  )
}

export interface ConfirmTriggerProps extends Omit<ConfirmDialogProps, 'open' | 'onOpenChange'> {
  /** Trigger button label. Also the default confirm button label. */
  label: ReactNode
  buttonProps?: Partial<FieldsButtonProps>
  isDisabled?: boolean
}

/**
 * Button + ConfirmDialog in one, for the common "press to confirm" case.
 * The confirm button repeats the trigger label unless `confirmText` is given,
 * so "Remove" opens a dialog whose affirmative action also says "Remove".
 */
const ConfirmTrigger = ({
  label,
  buttonProps = {},
  isDisabled,
  confirmText,
  ...dialogProps
}: ConfirmTriggerProps) => {

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        type="danger"
        isDisabled={isDisabled}
        {...buttonProps}
        onPress={() => setOpen(true)}
      >
        {label}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        confirmText={confirmText ?? label}
        {...dialogProps}
      />
    </>
  )
}

export { ConfirmTrigger }
export default ConfirmDialog
