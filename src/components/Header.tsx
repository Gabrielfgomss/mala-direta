import { Theme } from '../lib/theme';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card-bg border-b border-border transition-colors duration-200">
      <div className="max-w-full px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-20px font-700 text-fg">Mala Direta</h1>

        {/* Center + Right */}
        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="text-20px hover:opacity-70 transition-opacity duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a
              href="#sobre"
              className="text-14px font-500 text-fg hover:text-muted transition-colors duration-200"
            >
              Sobre
            </a>
            <a
              href="#"
              className="text-14px font-500 text-fg hover:text-muted transition-colors duration-200"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
