/**
 * AnswerOption component — Radio-button style option item for MCQ questions
 *
 * @param {string}   letter   - Option label: 'A' | 'B' | 'C' | 'D'
 * @param {string}   text     - Option text
 * @param {boolean}  selected - Whether this option is currently chosen
 * @param {Function} onSelect - Click handler to choose this option
 * @param {boolean}  disabled - Disable interactions
 */
export default function AnswerOption({
  letter,
  text,
  selected = false,
  onSelect,
  disabled = false,
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
        'flex items-center gap-4 rounded-lg border px-4 py-4 cursor-pointer select-none transition-colors duration-150',
        selected
          ? 'border-amber-500 bg-amber-500/10'
          : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {/* Option Letter Circle / Radio indicator */}
      <div
        className={[
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-xs font-semibold transition-colors',
          selected ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300',
        ].join(' ')}
      >
        {letter}
      </div>

      {/* Option Content Text */}
      <p className={`min-w-0 flex-1 text-base ${selected ? 'text-zinc-50' : 'text-zinc-200'}`}>
        {text}
      </p>
    </div>
  )
}
