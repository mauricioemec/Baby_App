import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
  required = false,
  icon: Icon,
  helperText,
  min,
  max,
  step,
  pattern,
  autoComplete,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const inputClasses = `
    block w-full px-4 py-2.5 text-base
    bg-white border rounded-lg
    transition-colors duration-200
    focus:outline-none focus:ring-2
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error
      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200'
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
    }
    ${Icon ? 'pl-11' : ''}
    ${isPassword ? 'pr-11' : ''}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1.5 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-1 text-danger-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}

        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          autoComplete={autoComplete}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <div id={`${name}-error`} className="flex items-center mt-1.5 text-sm text-danger-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}

      {!error && helperText && (
        <p id={`${name}-helper`} className="mt-1.5 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
