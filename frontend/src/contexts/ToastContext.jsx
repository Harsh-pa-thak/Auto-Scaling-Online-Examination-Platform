import { createContext, useState, useCallback, useRef } from 'react'
import Toast from '../components/common/Toast'

export const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    ({ title, message, type = 'info', duration = 4000 }) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev, { id, title, message, type, duration }])

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duration)
      }

      return id
    },
    []
  )

  // Convenience helpers
  const toast = {
    success: (title, message, duration) => addToast({ title, message, type: 'success', duration }),
    error:   (title, message, duration) => addToast({ title, message, type: 'error',   duration }),
    warning: (title, message, duration) => addToast({ title, message, type: 'warning', duration }),
    info:    (title, message, duration) => addToast({ title, message, type: 'info',    duration }),
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toast }}>
      {children}

      {/* Toast portal */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
