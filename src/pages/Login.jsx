import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn, AlertCircle, ShieldCheck, ChevronLeft } from 'lucide-react';

// ── Spinner inline ────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

// ── Paso 1: usuario + contraseña ──────────────────────────────────────────────
const StepCredentials = ({ onSuccess, onError }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      onError('Ingresa usuario y contraseña');
      return;
    }
    try {
      setLoading(true);
      onError('');
      const result = await login(form.username.trim(), form.password);
      onSuccess(result);
    } catch (err) {
      onError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoFocus
          value={form.username}
          onChange={handleChange}
          placeholder="admin"
          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 pr-11 text-sm text-white placeholder-gray-600 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors mt-2"
      >
        {loading ? <><Spinner /> Verificando...</> : <><LogIn size={16} /> Ingresar</>}
      </button>
    </form>
  );
};

// ── Paso 2: código TOTP ───────────────────────────────────────────────────────
const StepTwoFA = ({ tempToken, onBack, onError }) => {
  const { verify2FA } = useAuth();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => { refs[0].current?.focus(); }, []);

  const handleDigit = (index, value) => {
    const val = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    onError('');
    if (val && index < 5) refs[index + 1].current?.focus();
    // Auto-submit cuando se completan los 6 dígitos
    if (val && index === 5) {
      const code = [...next.slice(0, 5), val].join('');
      if (code.length === 6) submitCode(code);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) refs[index - 1].current?.focus();
    if (e.key === 'ArrowRight' && index < 5) refs[index + 1].current?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const next = pasted.split('');
      setDigits(next);
      refs[5].current?.focus();
      submitCode(pasted);
    }
    e.preventDefault();
  };

  const submitCode = async (code) => {
    try {
      setLoading(true);
      onError('');
      await verify2FA(tempToken, code);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      onError(err.message || 'Código incorrecto');
      setDigits(['', '', '', '', '', '']);
      refs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) { onError('Ingresa los 6 dígitos del código'); return; }
    submitCode(code);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-surface-2)] mb-2">
          <ShieldCheck size={22} className="text-primary" />
        </div>
        <p className="text-sm text-gray-300 font-medium">Verificación en dos pasos</p>
        <p className="text-xs text-gray-500">Ingresa el código de 6 dígitos de tu app autenticadora</p>
      </div>

      {/* Inputs de dígitos */}
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-12 text-center text-lg font-bold bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        ))}
      </div>

      <div className="space-y-2">
        <button
          type="submit"
          disabled={loading || digits.join('').length < 6}
          className="w-full bg-primary hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <><Spinner /> Verificando...</> : <><ShieldCheck size={16} /> Confirmar</>}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-xs text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1 py-1.5 transition-colors"
        >
          <ChevronLeft size={14} /> Volver al inicio de sesión
        </button>
      </div>
    </form>
  );
};

// ── Página principal de Login ─────────────────────────────────────────────────
const Login = () => {
  const [step, setStep] = useState('credentials'); // 'credentials' | '2fa'
  const [tempToken, setTempToken] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCredentialsSuccess = (result) => {
    if (result.requires2FA) {
      setTempToken(result.tempToken);
      setStep('2fa');
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleBack = () => {
    setStep('credentials');
    setTempToken(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <LogIn size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Control Carrera</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">5K / 10K — Sistema de Gestión</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-2xl">

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800/60 rounded-lg px-3 py-2.5 mb-5">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {step === 'credentials' && (
            <StepCredentials onSuccess={handleCredentialsSuccess} onError={setError} />
          )}

          {step === '2fa' && (
            <StepTwoFA tempToken={tempToken} onBack={handleBack} onError={setError} />
          )}
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          © 2026 Control Carrera. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;
