import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { CATEGORIAS, TALLAS, METODOS_PAGO } from '../../utils/constants';

const OPC_CATEGORIAS = CATEGORIAS.map((c) => ({ value: c, label: c }));

const ControlBoletoModal = ({
  isOpen,
  onClose,
  boleto,
  form,
  onChange,
  onSave,
  saving,
  error,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={`Confirmar Venta — Boleto #${boleto?.numero_boleto ?? ''}`}
    size="md"
    footer={
      <>
        <Button variant="outline" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="success" onClick={onSave} loading={saving}>
          Confirmar Vendido
        </Button>
      </>
    }
  >
    <div className="space-y-3">
      {/* Info del boleto */}
      {boleto && (
        <div className="bg-[var(--color-surface-2)] rounded-lg px-4 py-2.5 text-sm text-gray-400 border border-[var(--color-border)]">
          <span className="text-white font-semibold">
            {boleto.nombre_alumno || (boleto.nombre ? `${boleto.nombre} ${boleto.apellidos}` : '—')}
          </span>
          <span className="mx-1.5 text-gray-600">·</span>
          <span className="text-accent font-medium">Boleto #{boleto.numero_boleto}</span>
        </div>
      )}

      {error && (
        <div className="text-red-400 bg-red-900/20 border border-red-800 rounded px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <Select
        label="Categoría"
        name="categoria"
        value={form.categoria}
        onChange={onChange}
        options={OPC_CATEGORIAS}
        required
      />

      <Input
        label="Nombre del comprador"
        name="nombre_comprador"
        value={form.nombre_comprador}
        onChange={onChange}
        placeholder="Ej: Carlos Ramírez"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Talla de camiseta"
          name="talla_tshirt"
          value={form.talla_tshirt}
          onChange={onChange}
          options={TALLAS}
          required
        />
        <Input
          label="Monto (Q)"
          name="monto"
          type="number"
          value={form.monto}
          onChange={onChange}
          placeholder="Ej: 75.00"
          required
        />
      </div>

      <Select
        label="Método de pago"
        name="metodo_pago"
        value={form.metodo_pago}
        onChange={onChange}
        options={METODOS_PAGO}
        required
      />

      <Input
        label="Observación"
        name="observacion"
        value={form.observacion}
        onChange={onChange}
        placeholder="Opcional..."
      />
    </div>
  </Modal>
);

export default ControlBoletoModal;
