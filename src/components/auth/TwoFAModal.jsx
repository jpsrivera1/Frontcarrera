import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ShieldOff, X, AlertCircle, CheckCircle2, QrCode } from 'lucide-react';

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

// ── Modal de configuración de 2FA ─────────────────────────────────────────────
const TwoFAModal = ({ onClose }) => {
  const { setup2FA, enable2FA, disable2FA } = useAuth();

  const [phase, setPhase] = useState('menu');     // 'menu' | 'setup' | 'disable'
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Iniciar configuración de 2FA ──────────────────────────────────────────
  const handleStartSetup = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await setup2FA();
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setPhase('setup');
    } catch (err) {
      setError(err.message || 'Error al generar el código QR');
    } finally {
      setLoading(false);
    }
  };

  // ── Confirmar activación de 2FA ───────────────────────────────────────────
  const handleEnable = async (e) => {
    e.preventDefault();
    if (code.replace(/\s/g, '').length < 6) { setError('Ingresa el código de 6 dígitos'); return; }
    try {
      setLoading(true);
      setError('');
      await enable2FA(secret, code.replace(/\s/g, ''));
      setSuccess('2FA activado correctamente. Tu cuenta ahora requiere verificación en dos pasos.');
      setPhase('done');
    } catch (err) {
      setError(err.message || 'Código incorrecto');
    } finally {
      setLoading(false);
    }
  };

  // ── Desactivar 2FA ────────────────────────────────────────────────────────
  const handleDisable = async (e) => {
    e.preventDefault();
    if (code.replace(/\s/g, '').length < 6) { setError('Ingresa el código de 6 dígitos'); return; }
    try {
      setLoading(true);
      setError('');
      await disable2FA(code.replace(/\s/g, ''));
      setSuccess('2FA desactivado correctamente.');
      setPhase('done');
    } catch (err) {
      setError(err.message || 'Código incorrecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <span className="font-semibold text-white text-sm">Verificación en dos pasos (2FA)</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Mensajes de estado */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800/60 rounded-lg px-3 py-2.5">
              <AlertCircle size={14} className="shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 border border-green-800/60 rounded-lg px-3 py-2.5">
              <CheckCircle2 size={14} className="shrink-0" /> {success}
            </div>
          )}

          {/* ── Menú inicial ── */}
          {phase === 'menu' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">
                El doble factor de autenticación añade una capa extra de seguridad usando una app como
                <span className="text-white font-medium"> Google Authenticator</span> o
                <span className="text-white font-medium"> Authy</span>.
              </p>
              <button
                onClick={handleStartSetup}
                disabled={loading}
                className="w-full flex items-center gap-3 bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white transition-colors disabled:opacity-50"
              >
                {loading ? <Spinner /> : <QrCode size={18} className="text-primary" />}
                <div className="text-left">
                  <p className="font-medium">Activar 2FA</p>
                  <p className="text-xs text-gray-500">Escanea un código QR con tu app autenticadora</p>
                </div>
              </button>
              <button
                onClick={() => { setPhase('disable'); setError(''); setCode(''); }}
                className="w-full flex items-center gap-3 bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white transition-colors"
              >
                <ShieldOff size={18} className="text-gray-500" />
                <div className="text-left">
                  <p className="font-medium">Desactivar 2FA</p>
                  <p className="text-xs text-gray-500">Requiere un código válido de tu app</p>
                </div>
              </button>
            </div>
          )}

          {/* ── Setup: mostrar QR + pedir código de confirmación ── */}
          {phase === 'setup' && (
            <form onSubmit={handleEnable} className="space-y-4">
              <p className="text-xs text-gray-400">
                1. Abre tu app autenticadora y escanea este código QR.<br />
                2. Ingresa el código de 6 dígitos para confirmar.
              </p>
              {qrCode && (
                <div className="flex justify-center">
                  <img src={qrCode} alt="QR Code 2FA" className="w-44 h-44 rounded-xl border border-[var(--color-border)] bg-white p-2" />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs text-gray-500">O ingresa la clave manual:</p>
                <code className="block text-xs bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-3 py-2 text-primary tracking-widest break-all">
                  {secret}
                </code>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Código de verificación
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                  placeholder="123456"
                  autoFocus
                  className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 tracking-widest outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setPhase('menu'); setError(''); setCode(''); }}
                  className="flex-1 border border-[var(--color-border)] text-gray-400 hover:text-white rounded-lg py-2.5 text-sm transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={loading || code.length < 6}
                  className="flex-1 bg-primary hover:bg-[var(--color-primary-dark)] disabled:opacity-50 text-white font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors">
                  {loading ? <><Spinner /> Activando...</> : <><ShieldCheck size={15} /> Activar 2FA</>}
                </button>
              </div>
            </form>
          )}

          {/* ── Deshabilitar 2FA ── */}
          {phase === 'disable' && (
            <form onSubmit={handleDisable} className="space-y-4">
              <p className="text-xs text-gray-400">
                Ingresa el código de tu app autenticadora para desactivar el doble factor.
              </p>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Código de verificación
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                  placeholder="123456"
                  autoFocus
                  className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 tracking-widest outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setPhase('menu'); setError(''); setCode(''); }}
                  className="flex-1 border border-[var(--color-border)] text-gray-400 hover:text-white rounded-lg py-2.5 text-sm transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={loading || code.length < 6}
                  className="flex-1 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors">
                  {loading ? <><Spinner /> Desactivando...</> : <><ShieldOff size={15} /> Desactivar</>}
                </button>
              </div>
            </form>
          )}

          {/* ── Resultado exitoso ── */}
          {phase === 'done' && (
            <div className="text-center py-2">
              <button
                onClick={onClose}
                className="w-full bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] border border-[var(--color-border)] text-white text-sm rounded-lg py-2.5 transition-colors"
              >
                Cerrar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TwoFAModal;
