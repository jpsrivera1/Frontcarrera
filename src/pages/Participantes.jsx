import { useEffect, useState } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import DataTable from '../components/tables/DataTable';
import { formatFecha, formatNumeroCorredor } from '../utils/formatters';
import { CATEGORIAS, TALLAS, ESTADOS_PARTICIPANTE } from '../utils/constants';
import { Plus, Pencil, Trash2, Search, AlertCircle } from 'lucide-react';

const formInit = { nombre_completo: '', categoria: '5K', talla_tshirt: 'M' };
const editInit = { nombre_completo: '', categoria: '', talla_tshirt: '', estado: '' };

const Participantes = () => {
  const [data, setData]                 = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [search, setSearch]             = useState('');
  const [filtroOrigen, setFiltroOrigen] = useState('');
  const [modalAdd, setModalAdd]         = useState(false);
  const [modalEdit, setModalEdit]       = useState(false);
  const [selected, setSelected]         = useState(null);
  const [form, setForm]                 = useState(formInit);
  const [editForm, setEditForm]         = useState(editInit);
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/participantes');
      setData(res.data.data || []);
      setFiltered(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let rows = data;
    if (search.trim()) {
      const t = search.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.nombre_completo?.toLowerCase().includes(t) ||
          String(p.numero_corredor).includes(t)
      );
    }
    if (filtroOrigen) {
      rows = rows.filter((p) => (p.origen || 'Directo') === filtroOrigen);
    }
    setFiltered(rows);
  }, [search, filtroOrigen, data]);

  const handleAdd = async () => {
    setFormError('');
    if (!form.nombre_completo.trim()) return setFormError('El nombre es obligatorio');
    try {
      setSaving(true);
      await api.post('/participantes', form);
      setModalAdd(false);
      setForm(formInit);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (row) => {
    setSelected(row);
    setEditForm({
      nombre_completo: row.nombre_completo || '',
      categoria:       row.categoria       || '',
      talla_tshirt:    row.talla_tshirt    || '',
      estado:          row.estado          || '',
    });
    setFormError('');
    setModalEdit(true);
  };

  const handleEdit = async () => {
    setFormError('');
    if (!editForm.nombre_completo.trim()) return setFormError('El nombre es obligatorio');
    try {
      setSaving(true);
      await api.put(`/participantes/${selected.id}`, editForm);
      setModalEdit(false);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelar = async (row) => {
    if (!confirm(`¿Cancelar al participante "${row.nombre_completo}"?`)) return;
    try {
      await api.delete(`/participantes/${row.id}`);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    {
      key: 'numero_corredor',
      label: 'N° Corredor',
      width: '100px',
      render: (r) => (
        <span className="text-accent font-bold text-xs">{formatNumeroCorredor(r.numero_corredor)}</span>
      ),
    },
    { key: 'nombre_completo', label: 'Nombre' },
    {
      key: 'categoria',
      label: 'Cat.',
      width: '72px',
      render: (r) => <Badge label={r.categoria} />,
    },
    {
      key: 'talla_tshirt',
      label: 'Talla',
      width: '68px',
      render: (r) =>
        r.talla_tshirt ? (
          <span className="text-xs font-semibold text-gray-300 bg-dark-400 px-2 py-0.5 rounded">
            {r.talla_tshirt}
          </span>
        ) : (
          <span className="text-xs text-gray-600">—</span>
        ),
    },
    {
      key: 'origen',
      label: 'Origen',
      width: '78px',
      render: (r) => (
        <span className={`text-xs font-medium ${
          (r.origen || 'Directo') === 'Preventa'
            ? 'text-accent'
            : 'text-blue-400'
        }`}>
          {r.origen || 'Directo'}
        </span>
      ),
    },
    {
      key: 'estado_pago',
      label: 'Pago',
      width: '82px',
      render: (r) => <Badge label={r.estado_pago || 'Pagado'} />,
    },
    {
      key: 'estado',
      label: 'Estado',
      width: '78px',
      render: (r) => <Badge label={r.estado} />,
    },
    {
      key: 'fecha_registro',
      label: 'Registro',
      width: '90px',
      render: (r) => <span className="text-gray-500 text-xs">{formatFecha(r.fecha_registro)}</span>,
    },
    {
      key: 'acciones',
      label: '',
      width: '72px',
      render: (r) => (
        <div className="flex gap-1">
          <button
            onClick={() => openEdit(r)}
            className="p-1.5 rounded hover:bg-dark-400 text-gray-400 hover:text-accent transition-colors"
            title="Editar"
          >
            <Pencil size={14} />
          </button>
          {r.estado !== 'Cancelado' && (
            <button
              onClick={() => handleCancelar(r)}
              className="p-1.5 rounded hover:bg-dark-400 text-gray-400 hover:text-red-400 transition-colors"
              title="Cancelar"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
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

      <Card
        title={`Participantes (${filtered.length})`}
        action={
          <Button onClick={() => { setModalAdd(true); setFormError(''); }} size="sm">
            <Plus size={14} /> Registrar
          </Button>
        }
      >
        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Buscar por nombre o número de corredor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--color-surface-3)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder-gray-600 focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={filtroOrigen}
            onChange={(e) => setFiltroOrigen(e.target.value)}
            className="px-3 py-2 text-sm bg-[var(--color-surface-3)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:border-primary"
          >
            <option value="">Todos los orígenes</option>
            <option value="Directo">Directo</option>
            <option value="Preventa">Preventa</option>
          </select>
        </div>

        <DataTable columns={columns} data={filtered} loading={loading} emptyText="No hay participantes registrados" />
      </Card>

      {/* Modal Agregar */}
      <Modal
        isOpen={modalAdd}
        onClose={() => setModalAdd(false)}
        title="Registrar participante"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalAdd(false)}>Cancelar</Button>
            <Button onClick={handleAdd} loading={saving}>Registrar</Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <Input
            label="Nombre completo"
            required
            value={form.nombre_completo}
            onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })}
            placeholder="Ej: Juan Pérez"
          />
          <Select
            label="Categoría"
            required
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            options={CATEGORIAS}
          />
          <Select
            label="Talla de T-shirt"
            required
            value={form.talla_tshirt}
            onChange={(e) => setForm({ ...form, talla_tshirt: e.target.value })}
            options={TALLAS}
          />
          <p className="text-xs text-gray-600">El número de corredor se genera automáticamente.</p>
        </div>
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        title="Editar participante"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalEdit(false)}>Cancelar</Button>
            <Button onClick={handleEdit} loading={saving}>Guardar cambios</Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <Input
            label="Nombre completo"
            required
            value={editForm.nombre_completo}
            onChange={(e) => setEditForm({ ...editForm, nombre_completo: e.target.value })}
          />
          <Select
            label="Categoría"
            value={editForm.categoria}
            onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
            options={CATEGORIAS}
          />
          <Select
            label="Talla de T-shirt"
            value={editForm.talla_tshirt}
            onChange={(e) => setEditForm({ ...editForm, talla_tshirt: e.target.value })}
            options={TALLAS}
          />
          <Select
            label="Estado"
            value={editForm.estado}
            onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
            options={ESTADOS_PARTICIPANTE}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Participantes;
