import { useEffect, useState } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { AlertCircle } from 'lucide-react';

const BarRow = ({ label, value, max, color = 'bg-primary' }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-400">{value} <span className="text-gray-600">({pct}%)</span></span>
      </div>
      <div className="w-full h-2.5 bg-[var(--color-surface-3)] rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const Reportes = () => {
  const [tallas, setTallas]       = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [rT, rC] = await Promise.all([
          api.get('/dashboard/tallas'),
          api.get('/dashboard/categorias'),
        ]);
        setTallas(rT.data.data || []);
        setCategorias(rC.data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maxTalla = Math.max(...tallas.map((t) => parseInt(t.total) || 0), 1);
  const maxCat   = Math.max(...categorias.map((c) => parseInt(c.total) || 0), 1);
  const totalCat = categorias.reduce((s, c) => s + parseInt(c.total || 0), 0);
  const totalTal = tallas.reduce((s, t) => s + parseInt(t.total || 0), 0);

  const tallaColors = {
    XS: 'bg-purple-500',
    S:  'bg-blue-500',
    M:  'bg-accent',
    L:  'bg-green-500',
    XL: 'bg-orange-500',
    XXL:'bg-red-500',
  };

  const catColors = { '5K': 'bg-primary', '10K': 'bg-accent' };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        <svg className="animate-spin w-5 h-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Cargando reportes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categorías */}
        <Card title="Distribución por categoría">
          <div className="space-y-4">
            {categorias.map((c) => (
              <BarRow
                key={c.categoria}
                label={c.categoria}
                value={parseInt(c.total)}
                max={maxCat}
                color={catColors[c.categoria] || 'bg-primary'}
              />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex gap-4 text-sm">
            {categorias.map((c) => (
              <div key={c.categoria} className="flex items-center gap-2">
                <Badge label={c.categoria} />
                <span className="text-gray-300 font-bold">{c.total}</span>
                <span className="text-gray-600 text-xs">
                  ({totalCat > 0 ? Math.round((parseInt(c.total) / totalCat) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tallas */}
        <Card title="Control de tallas de T-shirt">
          <div className="space-y-4">
            {tallas.map((t) => (
              <BarRow
                key={t.talla_tshirt}
                label={t.talla_tshirt}
                value={parseInt(t.total)}
                max={maxTalla}
                color={tallaColors[t.talla_tshirt] || 'bg-primary'}
              />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border)] grid grid-cols-3 gap-2">
            {tallas.map((t) => (
              <div key={t.talla_tshirt} className="bg-[var(--color-surface-2)] rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-white">{t.total}</p>
                <p className="text-xs text-gray-500">{t.talla_tshirt}</p>
                <p className="text-xs text-gray-600">
                  {totalTal > 0 ? Math.round((parseInt(t.total) / totalTal) * 100) : 0}%
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Totales generales */}
      <Card title="Totales generales">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[var(--color-surface-2)] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-accent">{totalCat}</p>
            <p className="text-xs text-gray-500 mt-1">Total inscritos</p>
          </div>
          {categorias.map((c) => (
            <div key={c.categoria} className="bg-[var(--color-surface-2)] rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-primary">{c.total}</p>
              <p className="text-xs text-gray-500 mt-1">Inscritos {c.categoria}</p>
            </div>
          ))}
          <div className="bg-[var(--color-surface-2)] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{totalTal}</p>
            <p className="text-xs text-gray-500 mt-1">Tallas asignadas</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reportes;
