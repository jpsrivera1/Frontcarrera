const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
  disabled = false,
  error = '',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 text-sm rounded-md
          bg-[var(--color-surface-3)] border text-[var(--color-text)]
          placeholder-gray-600
          focus:outline-none focus:border-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-150
          ${error ? 'border-red-500' : 'border-[var(--color-border)]'}
        `}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default Input;
