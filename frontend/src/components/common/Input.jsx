import { forwardRef } from 'react'

/**
 * Input component
 *
 * @param {string}    id          - input id (links label htmlFor)
 * @param {string}    label       - label text
 * @param {string}    type        - HTML input type
 * @param {string}    error       - error message (shows red border + message)
 * @param {string}    helperText  - helper text shown below when no error
 * @param {boolean}   required    - adds required asterisk to label
 * @param {ReactNode} leftIcon    - icon inside input on the left
 * @param {ReactNode} rightSlot   - icon or button inside input on the right
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    helperText,
    required = false,
    disabled = false,
    leftIcon,
    rightSlot,
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
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={[
            'input-base',
            leftIcon ? 'pl-10' : '',
            rightSlot ? 'pr-10' : '',
            error ? 'input-error' : '',
          ].join(' ')}
          {...rest}
        />

        {rightSlot && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightSlot}
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={`${id}-helper`} className="text-xs text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

export default Input
