import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

/**
 * ConfirmDialog — wraps Modal for destructive action confirmation
 *
 * @param {boolean}  isOpen        - controls visibility
 * @param {Function} onClose       - called on cancel or backdrop click
 * @param {Function} onConfirm     - called when confirm button clicked
 * @param {string}   title         - dialog title
 * @param {string}   message       - body text (alias: description)
 * @param {string}   description   - body text
 * @param {string}   confirmLabel  - confirm button text (default: 'Confirm')
 * @param {string}   cancelLabel   - cancel button text (default: 'Cancel')
 * @param {string}   confirmVariant - button variant (default: 'danger')
 * @param {boolean}  loading       - shows spinner on confirm button
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  // legacy prop alias
  variant,
  loading = false,
}) {
  const body = message ?? description
  const resolvedVariant = confirmVariant ?? variant ?? 'danger'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlay={!loading}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={resolvedVariant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-950/50 border border-red-800/50">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          {body && (
            <p className="mt-1 text-sm text-zinc-400">{body}</p>
          )}
        </div>
      </div>
    </Modal>
  )
}
