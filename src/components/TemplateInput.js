import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export default function TemplateInput({ value, onChange, disabled = false }) {
    return (_jsxs("div", { children: [_jsxs("label", { className: "block text-14px font-500 text-fg mb-3", children: ["Template (texto puro com ", '{', "campo", '}', ")"] }), _jsx("textarea", { value: value, onChange: (e) => onChange(e.target.value), disabled: disabled, placeholder: "Ol\u00E1 {{nome}},\n\nSeu CPF \u00E9: {{cpf}}\n\nProcesso: {{processo}}", className: `w-full h-48 px-3 py-2 border border-border rounded-sm bg-card-bg text-14px font-400 text-fg placeholder:text-muted focus:outline-none focus:border-fg focus:ring-1 focus:ring-fg/10 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}` })] }));
}
