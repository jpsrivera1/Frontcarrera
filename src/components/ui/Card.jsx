const Card = ({ children, className = '', title = '', action = null }) => {
  return (
    <div
      className={`
        rounded-xl border border-[var(--color-border)]
        bg-[var(--color-surface)] p-5
        ${className}
      `}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
              {title}
            </h2>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
