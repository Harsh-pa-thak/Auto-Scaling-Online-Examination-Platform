import { useState, useRef, useEffect } from 'react'

/**
 * Dropdown item component
 */
export function DropdownItem({
  children,
  onClick,
  icon,
  danger = false,
  disabled = false,
  className = '',
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors duration-fast',
        danger
          ? 'text-danger hover:bg-danger-soft'
          : 'text-ink-2 hover:bg-sunken hover:text-ink',
        disabled ? 'opacity-40 cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      {icon && <span className="flex-shrink-0 text-ink-4">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  )
}

/**
 * Dropdown divider component
 */
export function DropdownDivider() {
  return <div className="my-1 border-t border-line" />
}

/**
 * Dropdown component
 *
 * @param {ReactNode} trigger    - Button/trigger element
 * @param {string}    align      - 'left' | 'right' (default: 'right')
 * @param {string}    width      - Tailwind width class (default: 'w-56')
 */
export default function Dropdown({
  trigger,
  children,
  align = 'right',
  width = 'w-56',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={[
            'absolute z-50 mt-2 p-1 bg-surface border border-line rounded-lg shadow-lg focus:outline-none animate-panel-in',
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
            width,
          ].join(' ')}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}
