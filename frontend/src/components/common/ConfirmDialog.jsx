import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

/**
 * ConfirmDialog — wraps Modal for destructive action confirmation
 *
 * @param {boolean}  isOpen      - controls visibility
 * @param {Function} onClose     - called on cancel or backdrop click
 * @param {Function} onConfirm   - called when confirm button clicked
 * @param {string}   title       - dialog title
 * @param {string}   description - body text
 * @param {string}   confirmLabel  - confirm button text (default: 'Confirm')
 * @param {string}   cancelLabel   - cancel button text (default: 'Cancel')
 * @param {string}   variant     - 'danger' | 'warning' (default: 'danger')
 * @param {boolean}  loading     - shows spinner on confirm button
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const iconColor = variant === 'danger' ? 'text-red-600' : 'text-amber-600'
  const iconBg    = variant === 'danger' ? 'bg-red-50'   : 'bg-amber-50'

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
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${iconBg}`}>
          <AlertTriangle size={20} className={iconColor} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          )}
        </div>
      </div>
    </Modal>
  )
}
