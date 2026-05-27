import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { AlertCircle, Plus, Ticket, Users, Filter, Search } from 'lucide-react';

import ResumenPreventaCards    from '../components/preventa/ResumenPreventaCards';
import AlumnosTable            from '../components/preventa/AlumnosTable';
import BoletosTable            from '../components/preventa/BoletosTable';
import AlumnoForm              from '../components/preventa/AlumnoForm';
import AsignarBoletosForm      from '../components/preventa/AsignarBoletosForm';
import ControlBoletoModal      from '../components/preventa/ControlBoletoModal';

import { CATEGORIAS, ESTADOS_BOLETO } from '../utils/constants';

// ─── Constantes de formulario ──────────────
const ALUMNO_INIT = {
  nombre: '', apellidos: '', grado: '', jornada: 'Matutina', modalidad: 'Presencial',
  fecha_nacimiento: '', nombre_encargado: '', telefono_encargado: '',
  telefono_estudiante: '', tipo_estudiante: 'REGULAR', uid_tarjeta: '',
};
const ALUMNO_EDIT_INIT = {
  nombre: '', apellidos: '', grado: '', jornada: 'Matutina', modalidad: 'Presencial',
  fecha_nacimiento: '', nombre_encargado: '', telefono_encargado: '',
  telefono_estudiante: '', tipo_estudiante: 'REGULAR', uid_tarjeta: '', estado: '',
};
const ASIGNAR_INIT      = { alumno_id: '', cantidad: 1 };
const CONTROL_INIT      = { nombre_comprador: '', categoria: '5K', talla_tshirt: 'M', monto: '', metodo_pago: 'Efectivo', observacion: '' };

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'alumnos',   label: 'Alumnos' },
  { key: 'boletos',   label: 'Boletos' },
];

// ─── Componente principal ──────────────────
const Preventa = () => {
  const [tab, setTab] = useState('dashboard');
  const [globalError, setGlobalError] = useState('');

  // ── Dashboard ──
  const [dashboard, setDashboard]     = useState({});
  const [dashLoading, setDashLoading] = useState(true);

  // ── Alumnos ──
  const [alumnos, setAlumnos]               = useState([]);
  const [alumnosLoading, setAlumnosLoading] = useState(false);
  const [modalAlumnoAdd, setModalAlumnoAdd] = useState(false);
  const [modalAlumnoEdit, setModalAlumnoEdit] = useState(false);
  const [alumnoForm, setAlumnoForm]         = useState(ALUMNO_INIT);
  const [alumnoEditForm, setAlumnoEditForm] = useState(ALUMNO_EDIT_INIT);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [alumnoSaving, setAlumnoSaving]     = useState(false);
  const [alumnoError, setAlumnoError]       = useState('');

  // ── Boletos ──
  const [boletos, setBoletos]               = useState([]);
  const [boletosLoading, setBoletosLoading] = useState(false);
  const [filteredBoletos, setFilteredBoletos] = useState([]);

  // ── Asignar boletos ──
  const [modalAsignar, setModalAsignar]   = useState(false);
  const [asignarForm, setAsignarForm]     = useState(ASIGNAR_INIT);
  const [asignarSaving, setAsignarSaving] = useState(false);
  const [asignarError, setAsignarError]   = useState('');

  // ── Control (marcar vendido) ──
  const [modalControl, setModalControl]   = useState(false);
  const [controlBoleto, setControlBoleto] = useState(null);
  const [controlForm, setControlForm]     = useState(CONTROL_INIT);
  const [controlSaving, setControlSaving] = useState(false);
  const [controlError, setControlError]   = useState('');

  // ── Filtros ──
  const [searchNumero, setSearchNumero]       = useState('');
  const [searchNombre, setSearchNombre]       = useState('');
  const [filterEstado, setFilterEstado]       = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');

  // ── Búsqueda rápida por N° de boleto ──
  const [quickNum, setQuickNum]         = useState('');
  const [quickError, setQuickError]     = useState('');

  // ─────────────────────────────────────────────
  // CARGA DE DATOS
  // ─────────────────────────────────────────────

  const loadDashboard = useCallback(async () => {
    try {
      setDashLoading(true);
      const res = await api.get('/preventa/dashboard-general');
      const raw = res.data.data;
      setDashboard(Array.isArray(raw) ? (raw[0] || {}) : (raw || {}));
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setDashLoading(false);
    }
  }, []);

  const loadAlumnos = useCallback(async () => {
    try {
      setAlumnosLoading(true);
      const res = await api.get('/preventa/alumnos');
      setAlumnos(res.data.data || []);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setAlumnosLoading(false);
    }
  }, []);

  const loadBoletos = useCallback(async () => {
    try {
      setBoletosLoading(true);
      const res = await api.get('/preventa/boletos');
      setBoletos(res.data.data || []);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setBoletosLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadDashboard(), loadAlumnos(), loadBoletos()]);
  }, [loadDashboard, loadAlumnos, loadBoletos]);

  useEffect(() => {
    loadDashboard();
    loadAlumnos();
  }, [loadDashboard, loadAlumnos]);

  useEffect(() => {
    if (tab === 'boletos') loadBoletos();
  }, [tab, loadBoletos]);

  // ── Filtrar boletos en cliente ──
  useEffect(() => {
    let result = boletos;
    if (searchNumero.trim()) {
      result = result.filter((b) =>
        String(b.numero_boleto).includes(searchNumero.trim())
      );
    }
    if (searchNombre.trim()) {
      const t = searchNombre.toLowerCase();
      result = result.filter(
        (b) =>
          (b.nombre_alumno || '').toLowerCase().includes(t) ||
          (`${b.nombre || ''} ${b.apellidos || ''}`).toLowerCase().includes(t) ||
          b.nombre_comprador?.toLowerCase().includes(t)
      );
    }
    if (filterEstado)     result = result.filter((b) => b.estado_boleto === filterEstado);
    if (filterCategoria)  result = result.filter((b) => b.categoria === filterCategoria);
    setFilteredBoletos(result);
  }, [boletos, searchNumero, searchNombre, filterEstado, filterCategoria]);

  // ─────────────────────────────────────────────
  // HANDLERS — ALUMNOS
  // ─────────────────────────────────────────────

  const handleAlumnoChange     = (e) => setAlumnoForm((p)     => ({ ...p, [e.target.name]: e.target.value }));
  const handleAlumnoEditChange = (e) => setAlumnoEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAddAlumno = async () => {
    setAlumnoError('');
    if (!alumnoForm.nombre.trim()) return setAlumnoError('El nombre es obligatorio');
    if (!alumnoForm.apellidos.trim()) return setAlumnoError('Los apellidos son obligatorios');
    try {
      setAlumnoSaving(true);
      await api.post('/preventa/alumnos', alumnoForm);
      setModalAlumnoAdd(false);
      setAlumnoForm(ALUMNO_INIT);
      await loadAlumnos();
    } catch (err) {
      setAlumnoError(err.message);
    } finally {
      setAlumnoSaving(false);
    }
  };

  const openEditAlumno = (alumno) => {
    setSelectedAlumno(alumno);
    setAlumnoEditForm({
      nombre:              alumno.nombre              || '',
      apellidos:           alumno.apellidos           || '',
      grado:               alumno.grado               || '',
      jornada:             alumno.jornada             || 'Matutina',
      modalidad:           alumno.modalidad           || 'Presencial',
      fecha_nacimiento:    alumno.fecha_nacimiento    || '',
      nombre_encargado:    alumno.nombre_encargado    || '',
      telefono_encargado:  alumno.telefono_encargado  || '',
      telefono_estudiante: alumno.telefono_estudiante || '',
      tipo_estudiante:     alumno.tipo_estudiante     || 'REGULAR',
      uid_tarjeta:         alumno.uid_tarjeta         || '',
      estado:              alumno.estado              || '',
    });
    setAlumnoError('');
    setModalAlumnoEdit(true);
  };

  const handleEditAlumno = async () => {
    setAlumnoError('');
    if (!alumnoEditForm.nombre.trim()) return setAlumnoError('El nombre es obligatorio');
    if (!alumnoEditForm.apellidos.trim()) return setAlumnoError('Los apellidos son obligatorios');
    try {
      setAlumnoSaving(true);
      await api.put(`/preventa/alumnos/${selectedAlumno.id}`, alumnoEditForm);
      setModalAlumnoEdit(false);
      await loadAlumnos();
    } catch (err) {
      setAlumnoError(err.message);
    } finally {
      setAlumnoSaving(false);
    }
  };

  const handleDesactivarAlumno = async (alumno) => {
    if (!confirm(`¿Desactivar al alumno "${alumno.nombre} ${alumno.apellidos}"?`)) return;
    try {
      await api.delete(`/preventa/alumnos/${alumno.id}`);
      await loadAlumnos();
    } catch (err) {
      alert(err.message);
    }
  };

  // ─────────────────────────────────────────────
  // HANDLERS — BOLETOS
  // ─────────────────────────────────────────────

  // Búsqueda rápida por correlativo (numero_boleto)
  const handleQuickSearch = () => {
    setQuickError('');
    const num = parseInt(quickNum.trim());
    if (!num || num < 1) {
      setQuickError('Ingresa un número de boleto válido');
      return;
    }
    // Comparación segura: convertir ambos lados a número para evitar fallos con string/number
    const boleto = boletos.find((b) => Number(b.numero_boleto) === num);
    if (!boleto) {
      setQuickError(`No se encontró el boleto #${num}`);
      return;
    }
    if (boleto.estado_boleto === 'Vendido') {
      setQuickError(`El boleto #${num} ya fue vendido a "${boleto.nombre_comprador}"`);
      return;
    }
    if (boleto.estado_boleto === 'Anulado') {
      setQuickError(`El boleto #${num} está anulado`);
      return;
    }
    // Encontrado y disponible → abrir modal de control
    setQuickNum('');
    openControlVendido(boleto);
  };

  const handleAsignarChange = (e) =>
    setAsignarForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAsignar = async () => {
    setAsignarError('');
    if (!asignarForm.alumno_id)  return setAsignarError('Seleccione un alumno vendedor');
    const qty = parseInt(asignarForm.cantidad);
    if (!qty || qty < 1)         return setAsignarError('La cantidad debe ser mayor a 0');
    try {
      setAsignarSaving(true);
      await api.post('/preventa/boletos/asignar-multiple', {
        alumno_id: asignarForm.alumno_id,
        cantidad:  qty,
      });
      setModalAsignar(false);
      setAsignarForm(ASIGNAR_INIT);
      await refreshAll();
    } catch (err) {
      setAsignarError(err.message);
    } finally {
      setAsignarSaving(false);
    }
  };

  const openControlVendido = (boleto) => {
    setControlBoleto(boleto);
    setControlForm(CONTROL_INIT);
    setControlError('');
    setModalControl(true);
  };

  const handleControlChange = (e) =>
    setControlForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleMarcarVendido = async () => {
    setControlError('');
    if (!controlForm.nombre_comprador.trim())
      return setControlError('El nombre del comprador es obligatorio');
    if (!controlForm.categoria)
      return setControlError('Seleccione una categoría (5K o 10K)');
    if (!controlForm.talla_tshirt)
      return setControlError('Seleccione una talla');
    if (!controlForm.monto || parseFloat(controlForm.monto) <= 0)
      return setControlError('El monto debe ser mayor a 0');
    if (!controlForm.metodo_pago)
      return setControlError('Seleccione un método de pago');
    try {
      setControlSaving(true);
      await api.put(`/preventa/boletos/${controlBoleto.id}/vendido`, {
        ...controlForm,
        monto: parseFloat(controlForm.monto),
      });
      setModalControl(false);
      await refreshAll();
    } catch (err) {
      setControlError(err.message);
    } finally {
      setControlSaving(false);
    }
  };

  const handleNoVendido = async (boleto) => {
    if (!confirm(`¿Marcar boleto #${boleto.numero_boleto} como "No vendido"?\nEl cupo quedará liberado.`)) return;
    try {
      await api.put(`/preventa/boletos/${boleto.id}/no-vendido`, { observacion: '' });
      await refreshAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAnular = async (boleto) => {
    if (!confirm(`¿Anular el boleto #${boleto.numero_boleto}?\nEl cupo quedará liberado.`)) return;
    try {
      await api.put(`/preventa/boletos/${boleto.id}/anular`, { observacion: '' });
      await refreshAll();
    } catch (err) {
      alert(err.message);
    }
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Preventa</h1>
          <p className="text-xs text-gray-500 mt-0.5">Control de boletos de preventa — Carrera 5K / 10K</p>
        </div>
      </div>

      {/* Error global */}
      {globalError && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {globalError}
          <button
            className="ml-auto text-red-400 hover:text-red-200"
            onClick={() => setGlobalError('')}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? 'border-primary text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: DASHBOARD ── */}
      {tab === 'dashboard' && (
        <ResumenPreventaCards data={dashboard} loading={dashLoading} />
      )}

      {/* ── TAB: ALUMNOS ── */}
      {tab === 'alumnos' && (
        <Card
          title="Alumnos Vendedores"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => { setAlumnoForm(ALUMNO_INIT); setAlumnoError(''); setModalAlumnoAdd(true); }}
            >
              <Plus size={14} /> Nuevo alumno
            </Button>
          }
        >
          <AlumnosTable
            data={alumnos}
            loading={alumnosLoading}
            onEdit={openEditAlumno}
            onDesactivar={handleDesactivarAlumno}
          />
        </Card>
      )}

      {/* ── TAB: BOLETOS ── */}
      {tab === 'boletos' && (
        <div className="space-y-4">

          {/* ── Control rápido por N° de boleto ── */}
          <Card>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 shrink-0">
                <Ticket size={15} className="text-primary" />
                Control rápido por N° de boleto
              </div>
              <div className="flex flex-1 items-center gap-2 w-full">
                <input
                  type="number"
                  min="1"
                  value={quickNum}
                  onChange={(e) => { setQuickNum(e.target.value); setQuickError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
                  placeholder="Ej: 42"
                  className="w-36 px-3 py-1.5 text-sm rounded-md bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-gray-600 focus:outline-none focus:border-primary"
                />
                <Button size="sm" variant="primary" onClick={handleQuickSearch}>
                  <Search size={13} /> Buscar y confirmar venta
                </Button>
              </div>
              {quickError && (
                <p className="text-xs text-red-400 shrink-0">{quickError}</p>
              )}
            </div>
          </Card>
          <div className="flex flex-wrap items-end gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => { setAsignarForm(ASIGNAR_INIT); setAsignarError(''); setModalAsignar(true); }}
            >
              <Ticket size={14} /> Asignar boletos
            </Button>

            <div className="flex flex-wrap items-end gap-2 ml-auto">
              {/* Buscador por N° de boleto */}
              <input
                type="number"
                min="1"
                value={searchNumero}
                onChange={(e) => setSearchNumero(e.target.value)}
                placeholder="N° boleto"
                className="w-28 px-3 py-1.5 text-sm rounded-md bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-gray-600 focus:outline-none focus:border-primary"
              />
              {/* Buscador por nombre */}
              <input
                type="text"
                value={searchNombre}
                onChange={(e) => setSearchNombre(e.target.value)}
                placeholder="Nombre alumno / comprador..."
                className="px-3 py-1.5 text-sm rounded-md bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-gray-600 focus:outline-none focus:border-primary w-52"
              />

              {/* Filtro estado */}
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-md bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="">Todos los estados</option>
                {ESTADOS_BOLETO.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>

              {/* Filtro categoría */}
              <select
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-md bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="">Todas las categorías</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Limpiar filtros */}
              {(searchNumero || searchNombre || filterEstado || filterCategoria) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setSearchNumero(''); setSearchNombre(''); setFilterEstado(''); setFilterCategoria(''); }}
                >
                  <Filter size={12} /> Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Contadores rápidos */}
          <div className="flex gap-3 text-xs text-gray-500">
            <span>
              Total: <strong className="text-white">{filteredBoletos.length}</strong>
            </span>
            {filterEstado && (
              <span>
                · Filtrando por <strong className="text-accent">{filterEstado}</strong>
              </span>
            )}
            {filterCategoria && (
              <span>
                · Categoría <strong className="text-primary">{filterCategoria}</strong>
              </span>
            )}
          </div>

          {/* Tabla */}
          <Card>
            <BoletosTable
              data={filteredBoletos}
              loading={boletosLoading}
              onVender={openControlVendido}
              onNoVendido={handleNoVendido}
              onAnular={handleAnular}
            />
          </Card>
        </div>
      )}

      {/* ── MODALES ── */}

      {/* Agregar alumno */}
      <AlumnoForm
        isOpen={modalAlumnoAdd}
        onClose={() => setModalAlumnoAdd(false)}
        form={alumnoForm}
        onChange={handleAlumnoChange}
        onSave={handleAddAlumno}
        saving={alumnoSaving}
        error={alumnoError}
      />

      {/* Editar alumno */}
      <AlumnoForm
        isOpen={modalAlumnoEdit}
        onClose={() => setModalAlumnoEdit(false)}
        form={alumnoEditForm}
        onChange={handleAlumnoEditChange}
        onSave={handleEditAlumno}
        saving={alumnoSaving}
        error={alumnoError}
        isEdit
      />

      {/* Asignar boletos */}
      <AsignarBoletosForm
        isOpen={modalAsignar}
        onClose={() => setModalAsignar(false)}
        form={asignarForm}
        onChange={handleAsignarChange}
        onSave={handleAsignar}
        saving={asignarSaving}
        error={asignarError}
        alumnos={alumnos}
      />

      {/* Control de boleto (marcar vendido) */}
      <ControlBoletoModal
        isOpen={modalControl}
        onClose={() => setModalControl(false)}
        boleto={controlBoleto}
        form={controlForm}
        onChange={handleControlChange}
        onSave={handleMarcarVendido}
        saving={controlSaving}
        error={controlError}
      />
    </div>
  );
};

export default Preventa;
