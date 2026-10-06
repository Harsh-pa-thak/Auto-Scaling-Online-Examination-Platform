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
        'flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors',
        danger
          ? 'text-red-600 hover:bg-red-50 active:bg-red-100'
          : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200',
        disabled ? 'opacity-40 cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      {icon && <span className="flex-shrink-0 text-slate-400 group-hover:text-slate-600">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  )
}

/**
 * Dropdown divider component
 */
export function DropdownDivider() {
  return <div className="my-1 border-t border-slate-100" />
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
            'absolute z-50 mt-2 p-1.5 bg-white border border-slate-200/80 rounded-xl shadow-lg shadow-slate-200/50 focus:outline-none animate-in fade-in zoom-in-95 duration-100',
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
