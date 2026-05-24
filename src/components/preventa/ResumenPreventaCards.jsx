import Card from '../ui/Card';
import { formatMoneda } from '../../utils/formatters';
import {
  Ticket, Users, Package, TrendingUp,
  CheckCircle, Clock, XCircle, AlertCircle,
} from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, color = 'text-white', sub }) => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex items-center gap-3">
    <div className={`p-2.5 rounded-lg bg-[var(--color-surface-2)] flex-shrink-0 ${color}`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wide truncate">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const ResumenPreventaCards = ({ data = {}, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
        <svg className="animate-spin w-5 h-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Cargando datos...
      </div>
    );
  }

  const d = Array.isArray(data) ? (data[0] || {}) : (data || {});
  const cuposTotal   = d.cupos_totales ?? 200;
  const ocupados     = d.cupos_ocupados ?? 0;
  const pct          = cuposTotal ? Math.round((ocupados / cuposTotal) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Fila 1 — cupos globales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard icon={Ticket}     label="Cupos Totales"           value={cuposTotal}                       color="text-white" />
        <MetricCard icon={Users}      label="Participantes Directos"  value={d.participantes_directos}         color="text-primary" />
        <MetricCard icon={Ticket}     label="Boletos Preventa Ocup."  value={d.boletos_preventa_ocupados}      color="text-accent" />
        <MetricCard icon={TrendingUp} label="Cupos Ocupados"          value={ocupados}                         color="text-orange-400" sub={`${pct}% del total`} />
        <MetricCard icon={CheckCircle} label="Cupos Disponibles"      value={d.cupos_disponibles}              color="text-green-400" />
      </div>

      {/* Fila 2 — estados de boletos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard icon={Clock}       label="Pendientes de Control"  value={d.boletos_pendientes_control}     color="text-yellow-400" />
        <MetricCard icon={CheckCircle} label="Boletos Vendidos"       value={d.boletos_vendidos}               color="text-green-400" />
        <MetricCard icon={XCircle}     label="Boletos No Vendidos"    value={d.boletos_no_vendidos}            color="text-gray-400" />
        <MetricCard icon={AlertCircle} label="Boletos Anulados"       value={d.boletos_anulados}               color="text-red-400" />
      </div>

      {/* Fila 3 — categorías y recaudo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricCard icon={TrendingUp} label="Preventa 5K"              value={d.preventa_5k}                   color="text-primary" />
        <MetricCard icon={TrendingUp} label="Preventa 10K"             value={d.preventa_10k}                  color="text-accent" />
        <MetricCard icon={Package}    label="Total Recaudado Preventa"  value={formatMoneda(d.total_recaudado_preventa)} color="text-green-400" />
      </div>
    </div>
  );
};

export default ResumenPreventaCards;
