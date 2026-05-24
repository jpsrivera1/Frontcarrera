export const formatFecha = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatFechaHora = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatMoneda = (valor) => {
  if (valor === null || valor === undefined) return 'Q 0.00';
  return `Q ${parseFloat(valor).toFixed(2)}`;
};

export const formatNumeroCorredor = (num) => {
  if (!num) return '—';
  return `#${String(num).padStart(6, '0')}`;
};
