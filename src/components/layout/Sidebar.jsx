import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  BarChart3,
  Timer,
  Tag,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/participantes', label: 'Participantes',  icon: Users },
  { to: '/pagos',         label: 'Pagos',          icon: CreditCard },
  { to: '/kits',          label: 'Kits',           icon: Package },
  { to: '/preventa',      label: 'Preventa',       icon: Tag },
  { to: '/reportes',      label: 'Reportes',       icon: BarChart3 },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
          <Timer size={20} className="text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white tracking-wide">SISTEMA</p>
          <p className="text-xs font-bold text-accent tracking-widest">CARRERA</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-primary/20 text-white border-l-2 border-primary pl-[10px]'
                    : 'text-gray-400 hover:bg-[var(--color-surface-3)] hover:text-gray-200'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className="px-5 py-4 border-t border-[var(--color-border)]">
        <p className="text-xs text-gray-600">Carrera 5K / 10K</p>
        <p className="text-xs text-gray-700">v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
