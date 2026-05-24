import { useEffect, useState } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import { formatMoneda } from '../utils/formatters';
import {
  Users, CreditCard, Package, TrendingUp,
  CheckCircle, Clock, Ticket, AlertCircle,
} from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, sub, color = 'text-white' }) => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-[var(--color-surface-2)] ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      setData(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const d = data[0] || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <svg className="animate-spin w-6 h-6 mr-2 text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Cargando dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-4">
        <AlertCircle size={18} />
        {error}
      </div>
    );
  }

  const cuposTotales  = d.cupos_totales  ?? 200;
  const inscritos     = d.total_inscritos ?? 0;
  const disponibles   = cuposTotales - inscritos;
  const inscritos5k   = d.inscritos_5k   ?? 0;
  const inscritos10k  = d.inscritos_10k  ?? 0;
  const pagosOk       = d.pagos_realizados ?? 0;
  const pagosPend     = d.pagos_pendientes ?? 0;
  const recaudado     = d.total_recaudado  ?? 0;
  const kitsOk        = d.kits_entregados  ?? 0;
  const kitsPend      = d.kits_pendientes  ?? 0;

  return (
    <div className="space-y-6">
      {/* Fila 1 — cupos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard icon={Ticket}    label="Cupos Totales"   value={cuposTotales}  color="text-white" />
        <MetricCard icon={Users}     label="Cupos Vendidos"  value={inscritos}     sub={`${cuposTotales ? Math.round((inscritos/cuposTotales)*100) : 0}% del total`} color="text-accent" />
        <MetricCard icon={Ticket}    label="Disponibles"     value={disponibles}   sub={`${cuposTotales ? Math.round((disponibles/cuposTotales)*100) : 0}% restantes`} color="text-green-400" />
        <MetricCard icon={TrendingUp} label="5K Inscritos"   value={inscritos5k}   color="text-primary" />
        <MetricCard icon={TrendingUp} label="10K Inscritos"  value={inscritos10k}  color="text-accent" />
      </div>

      {/* Fila 2 — pagos y kits */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard icon={CheckCircle} label="Pagos Realizados" value={pagosOk}    color="text-green-400" />
        <MetricCard icon={Clock}       label="Pagos Pendientes" value={pagosPend}  color="text-yellow-400" />
        <MetricCard icon={CreditCard}  label="Total Recaudado"  value={formatMoneda(recaudado)} color="text-accent" />
        <MetricCard icon={Package}     label="Kits Entregados"  value={kitsOk}     color="text-green-400" />
        <MetricCard icon={Clock}       label="Kits Pendientes"  value={kitsPend}   color="text-orange-400" />
      </div>

      {/* Barra de progreso de cupos */}
      <Card title="Progreso de ocupación">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{inscritos} inscritos</span>
            <span>{disponibles} disponibles</span>
          </div>
          <div className="w-full h-3 bg-[var(--color-surface-3)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
              style={{ width: `${cuposTotales ? (inscritos / cuposTotales) * 100 : 0}%` }}
            />
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" /> 5K: {inscritos5k}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent inline-block" /> 10K: {inscritos10k}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
