import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import DataTable from '../components/tables/DataTable';
import { formatFechaHora, formatNumeroCorredor } from '../utils/formatters';
import { CheckCircle, AlertCircle, Search, X } from 'lucide-react';

const FILTROS = [
  { key: 'todos',     label: 'Todos',     endpoint: '/kits' },
  { key: 'pendiente', label: 'Pendientes', endpoint: '/kits/pendientes' },
  { key: 'entregado', label: 'Entregados', endpoint: '/kits/entregados' },
];

const Kits = () => {
  const [data, setData]               = useState([]);
  const [filtro, setFiltro]           = useState('todos');
  const [search, setSearch]           = useState('');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [modal, setModal]             = useState(false);
  const [selected, setSelected]       = useState(null);
  const [observacion, setObservacion] = useState('');
  const [saving, setSaving]           = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const t = search.toLowerCase();
    return data.filter(
      (r) =>
        r.nombre_completo?.toLowerCase().includes(t) ||
        String(r.numero_corredor).includes(t) ||
        r.talla_tshirt?.toLowerCase().includes(t) ||
        r.categoria?.toLowerCase().includes(t)
    );
  }, [data, search]);

  const getEndpoint = (f) => FILTROS.find((x) => x.key === f)?.endpoint || '/kits';

  const load = async (f = filtro) => {
    try {
      setLoading(true);
      const res = await api.get(getEndpoint(f));
      setData(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(filtro); }, [filtro]);

  const openEntregar = (row) => {
    setSelected(row);
    setObservacion('');
    setModal(true);
  };

  const handleEntregar = async () => {
    try {
      setSaving(true);
      await api.put(`/kits/${selected.participante_id}/entregar`, { observacion });
      setModal(false);
      await load(filtro);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRevertir = async (row) => {
    if (!confirm(`¿Revertir la entrega del kit de "${row.nombre_completo}"?`)) return;
    try {
      await api.put(`/kits/${row.participante_id}/revertir`);
      await load(filtro);
    } catch (err) {
      alert(err.message);
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
    { key: 'categoria',   label: 'Cat.',   render: (r) => <Badge label={r.categoria} /> },
    {
      key: 'talla_tshirt',
      label: 'Talla',
      render: (r) => (
        <span className="text-xs font-semibold text-gray-300 bg-dark-400 px-2 py-0.5 rounded">
          {r.talla_tshirt}
        </span>
      ),
    },
    {
      key: 'kit_entregado',
      label: 'Estado kit',
      render: (r) => (
        <Badge label={r.kit_entregado ? 'Entregado' : 'No entregado'} />
      ),
    },
    {
      key: 'fecha_entrega',
      label: 'Fecha entrega',
      render: (r) => <span className="text-gray-500">{formatFechaHora(r.fecha_entrega)}</span>,
    },
    {
      key: 'acciones',
      label: '',
      width: '160px',
      render: (r) =>
        r.kit_entregado ? (
          <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium px-2">
            <CheckCircle size={13} /> Entregado
          </span>
        ) : (
          <Button
            variant="success"
            size="sm"
            onClick={() => openEntregar(r)}
          >
            <CheckCircle size={13} className="mr-1.5" />
            Entregar kit
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <Card title={`Entrega de Kits (${filtered.length})`}>
        {/* Filtros + Buscador */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
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

          {/* Buscador */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, N° corredor, talla o categoría..."
              className="w-full pl-8 pr-8 py-1.5 text-sm bg-[var(--color-surface-3)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        <DataTable columns={columns} data={filtered} loading={loading} emptyText="No hay kits en esta categoría" />
      </Card>

      {/* Modal entregar kit */}
      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={`Entregar kit — ${selected?.nombre_completo || ''}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button>
            <Button variant="success" onClick={handleEntregar} loading={saving}>
              <CheckCircle size={14} /> Confirmar entrega
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-400">
            Talla: <span className="text-white font-semibold">{selected?.talla_tshirt}</span>
            {' · '}
            Categoría: <span className="text-white font-semibold">{selected?.categoria}</span>
          </div>
          <Input
            label="Observación (opcional)"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder="Ej: Entregado en stand principal"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Kits;
