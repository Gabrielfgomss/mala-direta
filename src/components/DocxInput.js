import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
export default function DocxInput({ onFileLoaded, campos = [] }) {
    const [nomeArquivo, setNomeArquivo] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setNomeArquivo(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const arrayBuffer = event.target?.result;
                // Validar que é um arquivo .docx válido
                const zip = new PizZip(arrayBuffer);
                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                    syntax: {
                        allowUnopenedTag: true,
                        allowUnclosedTag: true
                    }
                });
                onFileLoaded(arrayBuffer);
            }
            catch (error) {
                console.error('Erro ao ler .docx:', error);
                alert('Arquivo .docx inválido');
                setNomeArquivo(null);
            }
        };
        reader.readAsArrayBuffer(file);
    };
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-14px font-500 text-foreground mb-3", children: "Ou fa\u00E7a upload de um arquivo .docx" }), _jsx("input", { type: "file", accept: ".docx", onChange: handleFileChange, className: "w-full px-3 py-2 border border-border rounded-sm bg-white text-14px cursor-pointer hover:border-foreground/30 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-colors" }), nomeArquivo && (_jsxs("div", { className: "mt-3 p-3 bg-white border border-border rounded-sm", children: [_jsxs("p", { className: "text-14px text-foreground mb-2", children: ["\u2713 Arquivo: ", _jsx("strong", { children: nomeArquivo })] }), campos.length > 0 && (_jsxs("p", { className: "text-12px text-muted", children: ["Campos: ", campos.join(', ')] }))] }))] }));
}
