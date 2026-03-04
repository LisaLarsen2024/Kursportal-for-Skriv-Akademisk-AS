import { GraduationCap, LogOut } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

interface LayoutProps {
  isAuthenticated: boolean;
  hasPaidAccess: boolean;
  onLogout: () => void;
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? 'bg-brand-teal text-white' : 'text-brand-teal hover:bg-brand-teal/10'
  }`;

const Layout = ({ isAuthenticated, hasPaidAccess, onLogout }: LayoutProps) => (
  <div className="min-h-screen">
    <header className="border-b border-brand-teal/10 bg-brand-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-brand-teal">
          <GraduationCap />
          <span className="font-heading text-xl">Skriv Akademisk</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navClass}>
            Hjem
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to={hasPaidAccess ? '/dashboard' : '/betaling'} className={navClass}>
                Kurs
              </NavLink>
              <NavLink to="/profil" className={navClass}>
                Min profil
              </NavLink>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-brand-coral hover:bg-brand-coral/10"
              >
                <LogOut size={16} /> Logg ut
              </button>
            </>
          )}
          {!isAuthenticated && (
            <NavLink to="/innlogging" className={navClass}>
              Logg inn
            </NavLink>
          )}
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Outlet />
    </main>
  </div>
);

export default Layout;
