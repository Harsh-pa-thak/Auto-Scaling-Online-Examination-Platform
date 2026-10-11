/**
 * AnswerOption component — Radio-button style option item for MCQ questions
 *
 * @param {string}   letter   - Option label: 'A' | 'B' | 'C' | 'D'
 * @param {string}   text     - Option text
 * @param {boolean}  selected - Whether this option is currently chosen
 * @param {Function} onSelect - Click handler to choose this option
 * @param {boolean}  disabled - Disable interactions
 * @param {number}   shortcut - Keyboard digit hint (1..4)
 */
export default function AnswerOption({
  letter,
  text,
  selected = false,
  onSelect,
  disabled = false,
  shortcut,
}) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={(e) => {
        if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault()
          onSelect()
        }
      }}
      className={[
        'flex items-center gap-4 rounded-lg border px-4 py-4 cursor-pointer select-none transition duration-fast',
        selected
          ? 'border-accent bg-accent-soft'
          : 'border-line hover:border-line-strong hover:bg-sunken/50',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {/* Option Letter Circle / Radio indicator */}
      <div
        className={[
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-xs font-semibold transition-colors duration-fast',
          selected ? 'bg-accent text-accent-ink' : 'bg-sunken text-ink-2',
        ].join(' ')}
      >
        {letter}
      </div>

      {/* Option Content Text */}
      <p className={`min-w-0 flex-1 text-base ${selected ? 'text-ink' : 'text-ink-2'}`}>
        {text}
      </p>

      {/* Keyboard hint */}
      {shortcut != null && (
        <kbd className="hidden h-6 min-w-[1.5rem] items-center justify-center rounded border border-line bg-surface px-1.5 text-2xs font-semibold text-ink-4 sm:inline-flex">
          {shortcut}
        </kbd>
      )}
    </div>
  )
}
