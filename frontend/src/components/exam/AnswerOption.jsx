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
        'group flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer select-none transition-all duration-150',
        selected
          ? 'border-primary-600 bg-primary-50/60 ring-2 ring-primary-500/20 shadow-xs'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 active:bg-slate-100',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {/* Option Letter Circle / Radio indicator */}
      <div
        className={[
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all',
          selected
            ? 'bg-primary-600 text-white shadow-xs'
            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900',
        ].join(' ')}
      >
        {letter}
      </div>

      {/* Option Content Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p
          className={`text-sm leading-relaxed transition-colors ${
            selected ? 'font-semibold text-slate-900' : 'text-slate-700'
          }`}
        >
          {text}
        </p>
      </div>

      {/* Radio Dot indicator on the right */}
      <div className="pt-1 flex-shrink-0">
        <div
          className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
            selected
              ? 'border-primary-600 bg-primary-600'
              : 'border-slate-300 bg-white group-hover:border-slate-400'
          }`}
        >
          {selected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
        </div>
      </div>
    </div>
  )
}
