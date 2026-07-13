import { jsx as _jsx } from "react/jsx-runtime";
export default function GenerateButton({ onClick }) {
    return (_jsx("button", { type: "button", onClick: onClick, className: "w-full px-6 py-3 bg-foreground text-white font-600 text-16px rounded-sm hover:bg-black/90 active:bg-black/80 transition-colors", children: "\u2B07 Gerar e baixar" }));
}
