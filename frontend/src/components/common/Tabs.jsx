import { useCallback, useEffect, useId, useRef, useState } from 'react'

/**
 * Tabs — accessible tab bar used by every filter/status surface.
 *
 * Renders only the tablist; the panels stay in the calling page so each screen
 * keeps ownership of its content and data fetching.
 *
 * Keyboard: ←/→ (and Home/End) move between tabs, roving tabindex so the
 * tablist is a single tab stop.
 *
 * @param {Array}    items        - [{ id, label, count?, icon?, disabled? }]
 * @param {string}   value        - active tab id
 * @param {Function} onChange     - (id) => void
 * @param {string}   variant      - 'underline' | 'pill'
 * @param {string}   ariaLabel    - accessible name for the tablist
 * @param {string}   panelId      - id of the panel these tabs control
 * @param {boolean}  scrollable   - allow horizontal scrolling (default true)
 */
export default function Tabs({
  items = [],
  value,
  onChange,
  variant = 'underline',
  ariaLabel = 'Sections',
  panelId,
  scrollable = true,
  className = '',
}) {
  const id = useId()
  const listRef = useRef(null)
  const [focusIndex, setFocusIndex] = useState(() =>
    Math.max(0, items.findIndex((item) => item.id === value))
  )

  useEffect(() => {
    const next = items.findIndex((item) => item.id === value)
    if (next >= 0) setFocusIndex(next)
  }, [value, items])

  const focusTab = useCallback(
    (index) => {
      const buttons = listRef.current?.querySelectorAll('[role="tab"]')
      const target = buttons?.[index]
      if (target) {
        setFocusIndex(index)
        target.focus()
      }
    },
    []
  )

  const handleKeyDown = (event, index) => {
    const last = items.length - 1
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        focusTab(index === last ? 0 : index + 1)
        break
      case 'ArrowLeft':
        event.preventDefault()
        focusTab(index === 0 ? last : index - 1)
        break
      case 'Home':
        event.preventDefault()
        focusTab(0)
        break
      case 'End':
        event.preventDefault()
        focusTab(last)
        break
      default:
        break
    }
  }

  if (!items.length) return null

  const isPill = variant === 'pill'

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      ref={listRef}
      className={[
        isPill
          ? 'inline-flex flex-wrap items-center gap-1 rounded-lg border border-line bg-sunken p-1'
          : 'flex gap-6 border-b border-line',
        scrollable ? 'overflow-x-auto scrollbar-none' : '',
        className,
      ].join(' ')}
    >
      {items.map((item, index) => {
        const isActive = item.id === value
        const tabId = `${id}-tab-${item.id}`

        return (
          <button
            key={item.id}
            id={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={index === focusIndex ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onChange?.(item.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={[
              'inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium transition duration-fast ease-standard',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isPill
                ? 'rounded-md px-3 py-1.5'
                : '-mb-px border-b-2 px-0.5 py-3',
              isPill
                ? isActive
                  ? 'bg-surface text-ink shadow-xs'
                  : 'text-ink-3 hover:text-ink'
                : isActive
                  ? 'border-accent text-ink'
                  : 'border-transparent text-ink-3 hover:border-line-strong hover:text-ink-2',
            ].join(' ')}
          >
            {item.icon && <span className="flex-shrink-0 text-ink-4">{item.icon}</span>}
            {item.label}
            {item.count != null && (
              <span
                className={[
                  'rounded-full px-1.5 py-0.5 text-2xs font-semibold tabular-nums',
                  isPill && isActive ? 'bg-accent-soft text-accent-strong' : 'bg-sunken text-ink-3',
                ].join(' ')}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
