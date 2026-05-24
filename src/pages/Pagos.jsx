import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import DataTable from '../components/tables/DataTable';
import { formatFechaHora, formatMoneda, formatNumeroCorredor } from '../utils/formatters';
import { METODOS_PAGO, ESTADOS_PAGO } from '../utils/constants';
import { CreditCard, Search, AlertCircle } from 'lucide-react';

const FILTROS = [
  { key: 'todos',     label: 'Todos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'pagado',    label: 'Pagados' },
];

const pagoInit = { monto: '', metodo_pago: 'Efectivo', estado_pago: 'Pagado', observacion: '' };

const Pagos = () => {
  const [data, setData]           = useState([]);
  const [filtro, setFiltro]       = useState('todos');
  const [busqueda, setBusqueda]   = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [modal, setModal]         = useState(false);
  const [selected, setSelected]   = useState(null);
  const [form, setForm]           = useState(pagoInit);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');

  const endpoints = {
    todos:     '/pagos',
    pendiente: '/pagos/pendientes',
    pagado:    '/pagos/pagados',
  };

  const load = async (f = filtro) => {
    try {
      setLoading(true);
      const res = await api.get(endpoints[f]);
      setData(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(filtro); }, [filtro]);

  const datosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return data;
    const t = busqueda.toLowerCase();
    return data.filter(
      (r) =>
        r.nombre_completo?.toLowerCase().includes(t) ||
        String(r.numero_corredor).includes(t)
    );
  }, [data, busqueda]);

  const openModal = (row) => {
    setSelected(row);
    setForm({
      monto:       row.monto       || '',
      metodo_pago: row.metodo_pago || 'Efectivo',
      estado_pago: row.estado_pago || 'Pagado',
      observacion: row.observacion || '',
    });
    setFormError('');
    setModal(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.monto || isNaN(parseFloat(form.monto))) {
      return setFormError('Ingrese un monto válido');
    }
    try {
      setSaving(true);
      await api.put(`/pagos/${selected.participante_id}`, {
        ...form,
        monto: parseFloat(form.monto),
      });
      setModal(false);
      await load(filtro);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'numero_corredor',
      label: 'N° Corredor',
      width: '120px',
      render: (r) => <span className="text-accent font-bold">{formatNumeroCorredor(r.numero_corredor)}</span>,
    },
    { key: 'nombre_completo', label: 'Participante' },
    { key: 'categoria', label: 'Cat.', render: (r) => <Badge label={r.categoria} /> },
    { key: 'monto', label: 'Monto', render: (r) => <span className="text-green-400">{formatMoneda(r.monto)}</span> },
    { key: 'metodo_pago', label: 'Método', render: (r) => <span className="text-gray-300">{r.metodo_pago || '—'}</span> },
    { key: 'estado_pago', label: 'Estado', render: (r) => <Badge label={r.estado_pago} /> },
    {
      key: 'fecha_pago',
      label: 'Fecha pago',
      render: (r) => <span className="text-gray-500">{formatFechaHora(r.fecha_pago)}</span>,
    },
    {
      key: 'acciones',
      label: '',
      width: '150px',
      render: (r) => {
        if (r.estado_pago === 'Pagado') {
          return (
            <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium px-2">
              <CreditCard size={13} /> Pagado
            </span>
          );
        }
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={() => openModal(r)}
          >
            <CreditCard size={13} className="mr-1.5" />
            Registrar pago
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <Card title={`Pagos (${datosFiltrados.length})`}>
        {/* Filtros y buscador */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex gap-2">
            {FILTROS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filtro === f.key
                    ? 'bg-primary text-white'
                    : 'bg-[var(--color-surface-3)] text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o N° corredor..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-[var(--color-surface-3)] border border-[var(--color-border)] text-gray-200 placeholder-gray-600 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <DataTable columns={columns} data={datosFiltrados} loading={loading} emptyText="No hay pagos en esta categoría" />
      </Card>

      {/* Modal editar pago */}
      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={`Actualizar pago — ${selected?.nombre_completo || ''}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <Input
            label="Monto (Q)"
            type="number"
            required
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
            placeholder="75.00"
          />
          <Select
            label="Método de pago"
            required
            value={form.metodo_pago}
            onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })}
            options={METODOS_PAGO}
          />
          <Select
            label="Estado del pago"
            required
            value={form.estado_pago}
            onChange={(e) => setForm({ ...form, estado_pago: e.target.value })}
            options={ESTADOS_PAGO}
          />
          <Input
            label="Observación"
            value={form.observacion}
            onChange={(e) => setForm({ ...form, observacion: e.target.value })}
            placeholder="Ej: Pago completo"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Pagos;
