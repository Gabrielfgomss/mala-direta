import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ProgressBar({ progress, isVisible, message }) {
    if (!isVisible)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-200", children: _jsxs("div", { className: "bg-card-bg rounded-sm shadow-lg p-8 max-w-400px mx-4 transition-colors duration-200", children: [_jsx("p", { className: "text-14px font-600 text-fg mb-4 text-center", children: message || 'Gerando arquivos...' }), _jsx("div", { className: "w-full h-2 bg-input rounded-sm overflow-hidden mb-4", children: _jsx("div", { className: "h-full bg-fg transition-all duration-300 ease-out", style: { width: `${progress}%` } }) }), _jsxs("p", { className: "text-12px font-500 text-muted text-center", children: [Math.round(progress), "%"] })] }) }));
}
