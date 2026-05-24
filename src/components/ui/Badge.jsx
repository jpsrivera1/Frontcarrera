const variants = {
  pagado:                   'bg-green-900/50 text-green-400 border border-green-800',
  pendiente:                'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
  anulado:                  'bg-red-900/50 text-red-400 border border-red-800',
  activo:                   'bg-blue-900/50 text-blue-400 border border-blue-800',
  cancelado:                'bg-gray-800 text-gray-400 border border-gray-700',
  entregado:                'bg-green-900/50 text-green-400 border border-green-800',
  'no entregado':           'bg-orange-900/50 text-orange-400 border border-orange-800',
  '5k':                     'bg-primary/20 text-red-400 border border-primary/40',
  '10k':                    'bg-accent/20 text-yellow-400 border border-accent/40',
  // Preventa
  'vendido':                'bg-green-900/50 text-green-400 border border-green-800',
  'pendiente de control':   'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
  'no vendido':             'bg-gray-800 text-gray-400 border border-gray-700',
  'inactivo':               'bg-gray-800 text-gray-500 border border-gray-700',
};

const Badge = ({ label, className = '' }) => {
  const key = (label || '').toLowerCase();
  const style = variants[key] || 'bg-dark-300 text-gray-400 border border-[var(--color-border)]';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
