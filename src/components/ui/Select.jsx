const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccione...',
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
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 text-sm rounded-md
          bg-[var(--color-surface-3)] border text-[var(--color-text)]
          focus:outline-none focus:border-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-150 cursor-pointer
          ${error ? 'border-red-500' : 'border-[var(--color-border)]'}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default Select;
