import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from './lib/theme';
import Header from './components/Header';
import Hero from './components/Hero';
import ToolSection from './components/ToolSection';
import Footer from './components/Footer';
export default function App() {
    const { theme, toggleTheme } = useTheme();
    return (_jsxs("div", { className: "min-h-screen bg-bg text-fg transition-colors duration-200", "data-theme": theme, children: [_jsx(Header, { theme: theme, onToggleTheme: toggleTheme }), _jsxs("main", { className: "pt-20 md:pt-16", children: [_jsx(Hero, {}), _jsx(ToolSection, {})] }), _jsx("div", { id: "conteudo" }), _jsx("div", {}), _jsx(Footer, {})] }));
}
