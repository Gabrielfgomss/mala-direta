import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Detectar preferência salva ou do sistema
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Atualizar CSS customizado
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--bg', '#0a0a0a');
      document.documentElement.style.setProperty('--fg', '#ffffff');
      document.documentElement.style.setProperty('--muted', '#999999');
      document.documentElement.style.setProperty('--border', '#2a2a2a');
      document.documentElement.style.setProperty('--card-bg', '#1a1a1a');
    } else {
      document.documentElement.style.setProperty('--bg', '#f9fafb');
      document.documentElement.style.setProperty('--fg', '#000000');
      document.documentElement.style.setProperty('--muted', '#666666');
      document.documentElement.style.setProperty('--border', '#e5e7eb');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}
