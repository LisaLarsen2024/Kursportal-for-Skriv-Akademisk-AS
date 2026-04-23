import { GraduationCap, LogOut, X, Sun, Moon, Home, BookOpen, User, BookMarked, Settings, ExternalLink, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/courseData';
import { useTheme } from '../hooks/useTheme';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-1.5 text-sm font-semibold transition-colors ${
    isActive
      ? 'text-[rgb(var(--c-primary))] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-[rgb(var(--c-primary))]'
      : 'text-brand-gray hover:text-[rgb(var(--c-primary))]'
  }`;

const Layout = () => {
  const { user, profile, signOut } = useAuth();
  const { completedLessonIds } = useProgress();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const isAuthenticated = !!user;
  const hasPaidAccess = profile?.hasPaidAccess ?? false;
  const hasNorskAccess = profile?.hasNorskAccess ?? false;
  const isAdmin = profile?.isAdmin ?? false;

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalCompleted = completedLessonIds.size;
  const totalProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const ThemeToggle = ({ className = '' }: { className?: string }) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Bytt til lys modus' : 'Bytt til mørk modus'}
      className={`rounded-full p-2 text-brand-gray hover:text-[rgb(var(--c-primary))] hover:bg-[rgb(var(--c-primary))]/10 transition-all ${className}`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[rgb(var(--c-bg))] flex flex-col">

      {/* Top progress bar */}
      {hasPaidAccess && totalLessons > 0 && (
        <div className="h-1 bg-[rgb(var(--c-border))] w-full fixed top-0 left-0 z-[60]">
          <div
            className="h-full bg-brand-coral transition-all duration-700"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      )}

      {/* Header */}
      <header
        className={`sticky z-50 border-b border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] ${
          hasPaidAccess ? 'top-1' : 'top-0'
        }`}
      >
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-3 gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-brand-teal shrink-0 group">
            <GraduationCap size={22} className="group-hover:rotate-6 transition-transform" />
            <span className="text-xl font-bold">
              Skriv Akademisk<sup className="text-[10px] font-normal opacity-60 ml-0.5">™</sup>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/" end className={navLinkClass}>Hjem</NavLink>
            {isAuthenticated && (
              <>
                <NavLink to={hasPaidAccess ? '/dashboard' : '/betaling'} className={navLinkClass}>
                  Akademisk skriving
                </NavLink>
                {hasNorskAccess && (
                  <NavLink to="/norsk/dashboard" className={navLinkClass}>Norsk VGS</NavLink>
                )}
                {hasPaidAccess && (
                  <NavLink to="/ressurser" className={navLinkClass}>Ressurser</NavLink>
                )}
                <NavLink to="/profil" className={navLinkClass}>Min profil</NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                )}
              </>
            )}
            {!isAuthenticated && (
              <NavLink to="/innlogging" className={navLinkClass}>Logg inn</NavLink>
            )}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {isAuthenticated && (
              <>
                <a
                  href="https://app.skrivakademisk.no"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[rgb(var(--c-border))] px-4 py-1.5 text-xs font-semibold text-brand-coral hover:bg-brand-coral hover:text-white transition-all"
                >
                  Skriveappen ↗
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-brand-gray hover:text-brand-coral transition-colors"
                  aria-label="Logg ut"
                >
                  <LogOut size={15} />
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Link
                to="/betaling"
                className="rounded-full bg-brand-coral px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 shadow-sm"
              >
                Kjøp tilgang
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-lg p-2 text-brand-teal hover:bg-brand-teal/10"
              aria-label="Åpne meny"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed top-0 right-0 z-[80] h-full w-[280px] bg-[rgb(var(--c-surface))] shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgb(var(--c-border))]">
          <div className="flex items-center gap-2 text-brand-teal">
            <GraduationCap size={20} />
            <span className="font-bold text-base">
              Skriv Akademisk<sup className="text-[9px] opacity-60">™</sup>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-full p-1.5 text-brand-gray hover:bg-[rgb(var(--c-border))]"
            aria-label="Lukk meny"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col px-3 py-4 gap-1">
          <MobileNavLink to="/" icon={<Home size={18} />} label="Hjem" onClick={() => setMenuOpen(false)} />
          {isAuthenticated && (
            <>
              <MobileNavLink
                to={hasPaidAccess ? '/dashboard' : '/betaling'}
                icon={<BookOpen size={18} />}
                label="Akademisk skriving"
                onClick={() => setMenuOpen(false)}
              />
              {hasNorskAccess && (
                <MobileNavLink to="/norsk/dashboard" icon={<BookMarked size={18} />} label="Norsk VGS" onClick={() => setMenuOpen(false)} />
              )}
              {hasPaidAccess && (
                <MobileNavLink to="/ressurser" icon={<BookOpen size={18} />} label="Ressurser" onClick={() => setMenuOpen(false)} />
              )}
              <MobileNavLink to="/profil" icon={<User size={18} />} label="Min profil" onClick={() => setMenuOpen(false)} />
              {isAdmin && (
                <MobileNavLink to="/admin" icon={<Settings size={18} />} label="Admin" onClick={() => setMenuOpen(false)} />
              )}
            </>
          )}
          {!isAuthenticated && (
            <MobileNavLink to="/innlogging" icon={<User size={18} />} label="Logg inn" onClick={() => setMenuOpen(false)} />
          )}

          {/* Theme toggle row */}
          <button
            type="button"
            onClick={toggle}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-brand-gray hover:bg-[rgb(var(--c-border))]/50 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Lys modus' : 'Mørk modus'}
          </button>
        </nav>

        {/* Separator + logout / skriveapp */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-[rgb(var(--c-border))] space-y-2">
          <a
            href="https://app.skrivakademisk.no"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-brand-coral hover:bg-brand-coral/10 transition-colors"
          >
            <ExternalLink size={18} />
            Skriveappen ↗
          </a>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-brand-gray hover:bg-[rgb(var(--c-border))]/50 transition-colors"
            >
              <LogOut size={18} />
              Logg ut
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto w-full max-w-content px-4 sm:px-6 py-8 flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] mt-8">
        <div className="mx-auto max-w-content px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-brand-teal">
                <GraduationCap size={20} />
                <span className="font-bold">
                  Skriv Akademisk<sup className="text-[9px] opacity-60">™</sup>
                </span>
              </div>
              <p className="text-xs text-brand-gray leading-relaxed">
                Videokurs i akademisk skriving og norskeksamen — enkelt forklart, slik at du forstår det som faktisk teller.
              </p>
              <p className="text-xs text-brand-gray/60">
                🌍 Skriveappen er tilgjengelig på 13 språk
              </p>
            </div>

            {/* Lenker */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray/60">Lenker</p>
              <div className="space-y-2">
                <a href="https://www.skrivakademisk.no" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-teal transition-colors">
                  <ExternalLink size={13} /> skrivakademisk.no
                </a>
                <a href="https://app.skrivakademisk.no" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-teal transition-colors">
                  <ExternalLink size={13} /> app.skrivakademisk.no
                </a>
                <a href="mailto:kontakt@skrivakademisk.no" className="flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-teal transition-colors">
                  <ExternalLink size={13} /> kontakt@skrivakademisk.no
                </a>
                <a href="https://www.instagram.com/skrivakademisk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-teal transition-colors">
                  <Instagram size={13} /> @skrivakademisk
                </a>
              </div>
            </div>

            {/* Juridisk */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray/60">Juridisk</p>
              <div className="space-y-2">
                <Link to="/vilkar" className="block text-sm text-brand-gray hover:text-brand-teal transition-colors">
                  Vilkår for bruk
                </Link>
                <Link to="/personvern" className="block text-sm text-brand-gray hover:text-brand-teal transition-colors">
                  Personvernerklæring
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[rgb(var(--c-border))] flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="space-y-0.5">
              <p className="text-xs text-brand-gray/60">
                © {new Date().getFullYear()} Skriv Akademisk™ AS · Alle rettigheter reservert.
              </p>
              <p className="text-xs text-brand-gray/40">
                Kursinnhold og videoer er opphavsrettslig beskyttet.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const MobileNavLink = ({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <NavLink
    to={to}
    end={to === '/'}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-[rgb(var(--c-primary))]/10 text-[rgb(var(--c-primary))] font-semibold'
          : 'text-[rgb(var(--c-ink))] hover:bg-[rgb(var(--c-border))]/50'
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default Layout;
