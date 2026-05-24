import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, UserCircle, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TwoFAModal from '../auth/TwoFAModal';

const titles = {
  '/dashboard':     'Dashboard',
  '/participantes': 'Control de Inscripciones',
  '/pagos':         'Control de Pagos',
  '/kits':          'Entrega de Kits',
  '/preventa':      'Pre-venta',
  '/reportes':      'Reportes',
};

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [show2FA, setShow2FA] = useState(false);
  const title = titles[pathname] || 'Sistema Carrera';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6 sticky top-0 z-30">
        <h1 className="text-sm font-semibold text-white tracking-widest uppercase">
          {title}
          <span className="ml-3 text-primary opacity-60 font-normal tracking-normal normal-case text-xs hidden sm:inline">
            ////////////////
          </span>
        </h1>

        <div className="flex items-center gap-4">
          <button className="relative text-gray-500 hover:text-white transition-colors">
            <Bell size={18} />
          </button>

          {/* Botón 2FA */}
          <button
            onClick={() => setShow2FA(true)}
            title="Configurar autenticación de doble factor"
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary border border-[var(--color-border)] hover:border-primary rounded-lg px-2.5 py-1 transition-colors"
          >
            <ShieldCheck size={14} />
            2FA
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <UserCircle size={22} className="text-gray-500" />
            <span className="hidden sm:block">{user?.nombre_completo || user?.username || 'Usuario'}</span>
          </div>

          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {show2FA && <TwoFAModal onClose={() => setShow2FA(false)} />}
    </>
  );
};

export default Navbar;

