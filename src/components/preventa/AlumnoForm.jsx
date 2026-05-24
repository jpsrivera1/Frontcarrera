import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { ESTADOS_ALUMNO } from '../../utils/constants';

const JORNADAS    = [{ value: 'Matutina', label: 'Matutina' }, { value: 'Vespertina', label: 'Vespertina' }, { value: 'Nocturna', label: 'Nocturna' }];
const MODALIDADES = [{ value: 'Presencial', label: 'Presencial' }, { value: 'Virtual', label: 'Virtual' }, { value: 'Semipresencial', label: 'Semipresencial' }];
const TIPOS       = [{ value: 'REGULAR', label: 'Regular' }, { value: 'BECADO', label: 'Becado' }, { value: 'ESPECIAL', label: 'Especial' }];

const AlumnoForm = ({
  isOpen,
  onClose,
  form,
  onChange,
  onSave,
  saving,
  error,
  isEdit = false,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={isEdit ? 'Editar Alumno Vendedor' : 'Registrar Alumno Vendedor'}
    size="lg"
    footer={
      <>
        <Button variant="outline" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSave} loading={saving}>
          {isEdit ? 'Guardar cambios' : 'Registrar'}
        </Button>
      </>
    }
  >
    <div className="space-y-3">
      {error && (
        <div className="text-red-400 bg-red-900/20 border border-red-800 rounded px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input label="Nombre" name="nombre" value={form.nombre} onChange={onChange} placeholder="Ej: Pedro" required />
        <Input label="Apellidos" name="apellidos" value={form.apellidos} onChange={onChange} placeholder="Ej: López García" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Grado" name="grado" value={form.grado} onChange={onChange} placeholder="Ej: Quinto Bachillerato" required />
        <Input label="Fecha de nacimiento" name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={onChange} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select label="Jornada" name="jornada" value={form.jornada} onChange={onChange} options={JORNADAS} required />
        <Select label="Modalidad" name="modalidad" value={form.modalidad} onChange={onChange} options={MODALIDADES} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Nombre del encargado" name="nombre_encargado" value={form.nombre_encargado} onChange={onChange} placeholder="Ej: María García" required />
        <Input label="Teléfono encargado" name="telefono_encargado" value={form.telefono_encargado} onChange={onChange} placeholder="Ej: 55555555" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Teléfono estudiante" name="telefono_estudiante" value={form.telefono_estudiante} onChange={onChange} placeholder="Ej: 44444444" />
        <Input label="UID Tarjeta" name="uid_tarjeta" value={form.uid_tarjeta} onChange={onChange} placeholder="Opcional" />
      </div>

      <Select label="Tipo de estudiante" name="tipo_estudiante" value={form.tipo_estudiante} onChange={onChange} options={TIPOS} />

      {isEdit && (
        <Select label="Estado" name="estado" value={form.estado} onChange={onChange} options={ESTADOS_ALUMNO} />
      )}
    </div>
  </Modal>
);

export default AlumnoForm;
