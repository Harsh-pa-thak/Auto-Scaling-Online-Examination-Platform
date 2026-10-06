import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'

/**
 * Select component
 *
 * @param {string}  id       - select id (links label)
 * @param {string}  label    - label text
 * @param {Array}   options  - [{ value, label }] or ['string']
 * @param {string}  error    - validation error message
 * @param {boolean} required - adds required asterisk
 */
const Select = forwardRef(function Select(
  {
    id,
    label,
    options = [],
    placeholder = 'Select an option',
    value,
    onChange,
    error,
    helperText,
    required = false,
    disabled = false,
    className = '',
    ...rest
  },
  ref
) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          className={[
            'input-base appearance-none pr-9 cursor-pointer',
            error ? 'input-error' : '',
            disabled ? 'cursor-not-allowed' : '',
          ].join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val   = typeof opt === 'object' ? opt.value : opt
            const label = typeof opt === 'object' ? opt.label : opt
            return (
              <option key={val} value={val}>
                {label}
              </option>
            )
          })}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-zinc-400">{helperText}</p>
      )}
    </div>
  )
})

export default Select
