import { useState, useRef, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Search, ChevronDown, X } from 'lucide-react';

const AlumnoCombobox = ({ alumnos, value, onChange }) => {
  const [query, setQuery]       = useState('');
  const [open, setOpen]         = useState(false);
  const containerRef            = useRef(null);

  const selected = alumnos.find((a) => String(a.id) === String(value));

  const filtered = query.trim()
    ? alumnos.filter((a) =>
        `${a.nombre} ${a.apellidos}`.toLowerCase().includes(query.toLowerCase())
      )
    : alumnos;

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (alumno) => {
    onChange({ target: { name: 'alumno_id', value: alumno.id } });
    setOpen(false);
    setQuery('');
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange({ target: { name: 'alumno_id', value: '' } });
    setQuery('');
  };

  return (
    <div className="space-y-1" ref={containerRef}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
        Alumno vendedor <span className="text-red-500">*</span>
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border bg-[var(--color-surface-3)] text-left transition-colors
          ${open ? 'border-primary' : 'border-[var(--color-border)]'}
          ${!selected ? 'text-gray-500' : 'text-[var(--color-text)]'}`}
      >
        <span className="truncate">{selected ? `${selected.nombre} ${selected.apellidos}` : 'Seleccione un alumno...'}</span>
        <span className="flex items-center gap-1 shrink-0 ml-2">
          {selected && (
            <X
              size={13}
              className="text-gray-500 hover:text-red-400 transition-colors"
              onClick={clear}
            />
          )}
          <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full max-w-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden">
          {/* Buscador */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border)]">
            <Search size={13} className="text-gray-500 shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar alumno..."
              className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder-gray-600 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-500 hover:text-gray-300">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Lista */}
          <ul className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-sm text-gray-500 text-center">Sin resultados</li>
            ) : (
              filtered.map((a) => (
                <li
                  key={a.id}
                  onClick={() => select(a)}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors
                    ${String(a.id) === String(value)
                      ? 'bg-primary/20 text-red-400'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-surface-3)]'}`}
                >
                  {a.nombre} {a.apellidos}
                  {a.grado && (
                    <span className="ml-2 text-xs text-gray-500">{a.grado}{a.jornada ? ` · ${a.jornada}` : ''}</span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const AsignarBoletosForm = ({
  isOpen,
  onClose,
  form,
  onChange,
  onSave,
  saving,
  error,
  alumnos = [],
}) => {
  const alumnosActivos = alumnos.filter((a) => a.estado === 'Activo');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Asignar Boletos de Preventa"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onSave} loading={saving}>
            Asignar Boletos
          </Button>
        </>
      }
    >
      <div className="space-y-3 relative">
        {error && (
          <div className="text-red-400 bg-red-900/20 border border-red-800 rounded px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <AlumnoCombobox
          alumnos={alumnosActivos}
          value={form.alumno_id}
          onChange={onChange}
        />

        <Input
          label="Cantidad de boletos"
          name="cantidad"
          type="number"
          value={form.cantidad}
          onChange={onChange}
          placeholder="Ej: 5"
          required
        />

        <p className="text-xs text-gray-500 pt-1">
          La categoría (5K / 10K) se define al momento de confirmar la venta. No ingreses nombre ni talla ahora.
        </p>
      </div>
    </Modal>
  );
};

export default AsignarBoletosForm;
