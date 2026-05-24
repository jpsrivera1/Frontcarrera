import { Link } from 'react-router-dom';
import { Timer } from 'lucide-react';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
    <Timer size={64} className="text-primary opacity-40" />
    <div>
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-gray-400 mt-2">Página no encontrada</p>
    </div>
    <Link
      to="/dashboard"
      className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
    >
      Volver al Dashboard
    </Link>
  </div>
);

export default NotFound;
