import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ValuesInput({ value, onChange }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-14px font-500 text-foreground mb-3", children: "Lista de Valores (um por linha, separados por |)" }), _jsx("textarea", { value: value, onChange: (e) => onChange(e.target.value), placeholder: "Jo\u00E3o Silva|123.456.789-00|2024-001\nMaria Santos|987.654.321-00|2024-002\nPedro Costa|456.789.123-00|2024-003", className: "w-full h-48 px-3 py-2 border border-border rounded-sm bg-white text-14px font-400 text-foreground placeholder:text-muted focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-colors" })] }));
}
