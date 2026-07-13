import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as XLSX from 'xlsx';
export default function ExcelInput({ onDataLoaded, campos }) {
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target?.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                // Converter para formato esperado
                const dados = jsonData.map((row) => {
                    const obj = {};
                    campos.forEach((campo) => {
                        obj[campo] = String(row[campo] || '');
                    });
                    return obj;
                });
                onDataLoaded(dados);
                e.target.value = '';
            }
            catch (error) {
                console.error('Erro ao ler Excel:', error);
                alert('Erro ao ler o arquivo Excel. Certifique-se de que está em formato válido.');
            }
        };
        reader.readAsArrayBuffer(file);
    };
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-14px font-500 text-fg mb-2", children: "Importar dados de Excel" }), _jsxs("p", { className: "text-12px text-muted mb-3", children: ["Use as colunas: ", campos.join(', ')] }), _jsx("input", { type: "file", accept: ".xlsx,.xls,.csv", onChange: handleFileChange, className: "w-full px-3 py-2 border border-border rounded-sm bg-card-bg text-14px cursor-pointer hover:border-fg/30 focus:outline-none focus:border-fg focus:ring-1 focus:ring-fg/10 transition-colors" })] }));
}
