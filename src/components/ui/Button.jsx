const variants = {
  primary: 'bg-primary hover:bg-primary-dark text-white border-transparent',
  secondary: 'bg-dark-300 hover:bg-dark-400 text-gray-200 border-transparent',
  danger: 'bg-red-700 hover:bg-red-800 text-white border-transparent',
  success: 'bg-green-700 hover:bg-green-800 text-white border-transparent',
  outline: 'bg-transparent hover:bg-dark-300 text-gray-200 border-[var(--color-border)]',
  accent: 'bg-accent hover:bg-accent-dark text-black border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-md border
        transition-colors duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
