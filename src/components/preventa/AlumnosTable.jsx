import DataTable from '../tables/DataTable';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Pencil, UserX } from 'lucide-react';
import { formatFecha } from '../../utils/formatters';

const AlumnosTable = ({ data = [], loading = false, onEdit, onDesactivar }) => {
  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (r) => (
        <div>
          <span className="font-medium text-white">{r.nombre} {r.apellidos}</span>
          <p className="text-xs text-gray-500">{r.tipo_estudiante || 'REGULAR'}</p>
        </div>
      ),
    },
    { key: 'grado', label: 'Grado' },
    { key: 'jornada', label: 'Jornada', width: '90px' },
    { key: 'telefono_estudiante', label: 'Telef.', width: '90px', render: (r) => r.telefono_estudiante || '—' },
    {
      key: 'estado',
      label: 'Estado',
      width: '100px',
      render: (r) => <Badge label={r.estado} />,
    },
    {
      key: 'fecha_registro',
      label: 'Registro',
      width: '110px',
      render: (r) => <span className="text-gray-500 text-xs">{formatFecha(r.fecha_registro)}</span>,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      width: '100px',
      render: (r) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => onEdit(r)} title="Editar">
            <Pencil size={12} />
          </Button>
          {r.estado !== 'Inactivo' && (
            <Button size="sm" variant="danger" onClick={() => onDesactivar(r)} title="Desactivar">
              <UserX size={12} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyText="No hay alumnos vendedores registrados"
    />
  );
};

export default AlumnosTable;
