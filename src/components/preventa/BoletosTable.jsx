import DataTable from '../tables/DataTable';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { CheckCircle, XCircle, Ban } from 'lucide-react';
import { formatFecha, formatMoneda, formatNumeroCorredor } from '../../utils/formatters';

// Mapeo estado_boleto → label del Badge
const BADGE_LABEL = {
  Asignado:     'Pendiente de control',
  Vendido:      'Vendido',
  'No vendido': 'No vendido',
  Anulado:      'Anulado',
};

const BoletosTable = ({ data = [], loading = false, onVender, onNoVendido, onAnular }) => {
  const columns = [
    {
      key: 'numero_boleto',
      label: 'N° Boleto',
      width: '100px',
      render: (r) => (
        <span className="text-accent font-bold">#{r.numero_boleto}</span>
      ),
    },
    {
      key: 'nombre',
      label: 'Alumno Vendedor',
      render: (r) => (
        <div>
          <p className="text-white font-medium">
            {r.nombre_alumno || (r.nombre ? `${r.nombre} ${r.apellidos}` : '—')}
          </p>
          <p className="text-xs text-gray-500">
            {r.grado || ''}
            {r.jornada ? ` · ${r.jornada}` : ''}
          </p>
        </div>
      ),
    },
    {
      key: 'categoria',
      label: 'Cat.',
      width: '70px',
      render: (r) => <Badge label={r.categoria ?? 'Por definir'} />,
    },
    {
      key: 'estado_boleto',
      label: 'Estado',
      width: '160px',
      render: (r) => <Badge label={BADGE_LABEL[r.estado_boleto] ?? r.estado_boleto} />,
    },
    {
      key: 'nombre_comprador',
      label: 'Comprador',
      render: (r) =>
        r.nombre_comprador ? (
          <span className="text-white">{r.nombre_comprador}</span>
        ) : (
          <span className="text-gray-600 italic text-xs">Sin comprador</span>
        ),
    },
    {
      key: 'talla_tshirt',
      label: 'Talla',
      width: '70px',
      render: (r) => r.talla_tshirt || '—',
    },
    {
      key: 'monto',
      label: 'Monto',
      width: '90px',
      render: (r) =>
        r.monto ? (
          <span className="text-green-400">{formatMoneda(r.monto)}</span>
        ) : (
          '—'
        ),
    },
    {
      key: 'metodo_pago',
      label: 'Método',
      width: '120px',
      render: (r) => r.metodo_pago || '—',
    },
    {
      key: 'numero_corredor',
      label: 'Corredor',
      width: '105px',
      render: (r) =>
        r.numero_corredor ? (
          <span className="text-accent font-medium">
            {formatNumeroCorredor(r.numero_corredor)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'fecha_asignacion',
      label: 'Asignado',
      width: '100px',
      render: (r) => (
        <span className="text-gray-500 text-xs">{formatFecha(r.fecha_asignacion)}</span>
      ),
    },
    {
      key: 'fecha_confirmacion',
      label: 'Confirmado',
      width: '105px',
      render: (r) => (
        <span className="text-gray-500 text-xs">{formatFecha(r.fecha_confirmacion)}</span>
      ),
    },
    {
      key: 'observacion',
      label: 'Observación',
      render: (r) => (
        <span className="text-gray-500 text-xs">{r.observacion || '—'}</span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      width: '165px',
      render: (r) => {
        if (r.estado_boleto === 'Asignado') {
          return (
            <div className="flex gap-1 flex-wrap">
              <Button size="sm" variant="success" onClick={() => onVender(r)} title="Confirmar vendido">
                <CheckCircle size={12} />
                <span>Vendido</span>
              </Button>
              <Button size="sm" variant="outline" onClick={() => onNoVendido(r)} title="No vendido">
                <XCircle size={12} />
              </Button>
              <Button size="sm" variant="danger" onClick={() => onAnular(r)} title="Anular">
                <Ban size={12} />
              </Button>
            </div>
          );
        }
        if (r.estado_boleto === 'Vendido') {
          return (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <CheckCircle size={12} /> Confirmado
            </span>
          );
        }
        return <span className="text-xs text-gray-600">—</span>;
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyText="No hay boletos de preventa"
    />
  );
};

export default BoletosTable;
