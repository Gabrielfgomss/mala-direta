import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useRef } from 'react';
const ITEMS_PER_PAGE = 10;
export default function ValuesTable({ campos, onChange, initialData }) {
    const [dadosImportados, setDadosImportados] = useState([]);
    const [dadosAdicionados, setDadosAdicionados] = useState([{}]);
    const [currentPageImportados, setCurrentPageImportados] = useState(1);
    const [currentPageAdicionados, setCurrentPageAdicionados] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const dataLoadedRef = useRef(false);
    // Carregar dados iniciais apenas uma vez
    useEffect(() => {
        if (initialData && initialData.length > 0 && !dataLoadedRef.current) {
            setDadosImportados(initialData);
            setDadosAdicionados([{}]);
            dataLoadedRef.current = true;
        }
    }, [initialData]);
    // Combinar dados para onChange
    useEffect(() => {
        const todosDados = [...dadosImportados, ...dadosAdicionados.filter(row => Object.keys(row).length > 0)];
        onChange(todosDados);
    }, [dadosImportados, dadosAdicionados, onChange]);
    // Filtered imported data
    const filteredImportados = useMemo(() => {
        if (!searchTerm.trim())
            return dadosImportados;
        const term = searchTerm.toLowerCase();
        return dadosImportados.filter((linha) => Object.values(linha).some((valor) => String(valor || '').toLowerCase().includes(term)));
    }, [dadosImportados, searchTerm]);
    const totalPagesImportados = Math.ceil(filteredImportados.length / ITEMS_PER_PAGE);
    const startIdxImportados = (currentPageImportados - 1) * ITEMS_PER_PAGE;
    const endIdxImportados = startIdxImportados + ITEMS_PER_PAGE;
    const currentDataImportados = filteredImportados.slice(startIdxImportados, endIdxImportados);
    // Added data (no filtering)
    const totalPagesAdicionados = Math.ceil(dadosAdicionados.length / ITEMS_PER_PAGE);
    const startIdxAdicionados = (currentPageAdicionados - 1) * ITEMS_PER_PAGE;
    const endIdxAdicionados = startIdxAdicionados + ITEMS_PER_PAGE;
    const currentDataAdicionados = dadosAdicionados.slice(startIdxAdicionados, endIdxAdicionados);
    const handleCellChangeImportados = (dataIndex, campo, valor) => {
        // dataIndex é relativo à página atual (0-9), precisa ajustar para o índice no array filtrado
        const indexInFiltered = startIdxImportados + dataIndex;
        const novosDadosImportados = [...dadosImportados];
        novosDadosImportados[indexInFiltered] = {
            ...novosDadosImportados[indexInFiltered],
            [campo]: valor
        };
        setDadosImportados(novosDadosImportados);
    };
    const handleCellChangeAdicionados = (displayIndex, campo, valor) => {
        const novosDados = [...dadosAdicionados];
        novosDados[startIdxAdicionados + displayIndex] = { ...novosDados[startIdxAdicionados + displayIndex], [campo]: valor };
        setDadosAdicionados(novosDados);
    };
    const removerLinhaImportada = (displayIndex) => {
        const indexNoOriginal = dadosImportados.indexOf(currentDataImportados[displayIndex]);
        const novosDados = dadosImportados.filter((_, i) => i !== indexNoOriginal);
        setDadosImportados(novosDados);
        const newTotalPages = Math.ceil(novosDados.length / ITEMS_PER_PAGE);
        if (currentPageImportados > newTotalPages) {
            setCurrentPageImportados(Math.max(1, newTotalPages));
        }
    };
    const removerLinhaAdicionada = (displayIndex) => {
        const originalIndex = startIdxAdicionados + displayIndex;
        if (dadosAdicionados.length > 1) {
            const novosDados = dadosAdicionados.filter((_, i) => i !== originalIndex);
            setDadosAdicionados(novosDados);
            const newTotalPages = Math.ceil(novosDados.length / ITEMS_PER_PAGE);
            if (currentPageAdicionados > newTotalPages) {
                setCurrentPageAdicionados(Math.max(1, newTotalPages));
            }
        }
    };
    const adicionarLinha = () => {
        setDadosAdicionados([...dadosAdicionados, {}]);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "mb-4 flex flex-col gap-3", children: [_jsx("label", { className: "block text-14px font-500 text-fg", children: "Valores para cada campo" }), _jsx("input", { type: "text", placeholder: "\uD83D\uDD0D Buscar nos dados...", value: searchTerm, onChange: (e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPageImportados(1);
                                }, className: "px-3 py-2 border border-border rounded-sm bg-card-bg text-14px text-fg placeholder:text-muted focus:outline-none focus:border-fg focus:ring-1 focus:ring-fg/10 transition-colors" }), _jsx("p", { className: "text-12px text-muted", children: searchTerm ? (_jsxs(_Fragment, { children: ["Mostrando ", Math.min(startIdxImportados + 1, filteredImportados.length), " a ", Math.min(endIdxImportados, filteredImportados.length), " de ", filteredImportados.length, " resultados"] })) : (_jsxs(_Fragment, { children: ["Mostrando ", dadosImportados.length > 0 ? startIdxImportados + 1 : 0, " a ", Math.min(endIdxImportados, dadosImportados.length), " de ", dadosImportados.length, " linhas"] })) })] }), dadosImportados.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "overflow-x-auto border border-border rounded-sm bg-card-bg mb-4", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-input border-b border-border", children: [_jsx("th", { className: "w-12 px-4 py-2 text-left text-12px font-600 text-fg", children: "#" }), campos.map((campo) => (_jsx("th", { className: "min-w-32 px-4 py-2 text-left text-12px font-600 text-fg border-l border-border", children: campo }, campo))), _jsx("th", { className: "w-10 px-4 py-2 text-center text-12px font-600 text-fg border-l border-border", children: "\u2014" })] }) }), _jsx("tbody", { children: currentDataImportados.map((linha, displayIndex) => {
                                                const originalIndex = dadosImportados.indexOf(linha);
                                                return (_jsxs("tr", { className: "hover:bg-input border-b border-border", children: [_jsx("td", { className: "px-4 py-2 text-12px text-muted", children: originalIndex + 1 }), campos.map((campo) => (_jsx("td", { className: "px-3 py-2 border-l border-border", children: _jsx("input", { type: "text", value: linha[campo] || '', onChange: (e) => handleCellChangeImportados(displayIndex, campo, e.target.value), className: "w-full px-2 py-1 text-14px border border-border rounded-sm bg-card-bg text-fg placeholder:text-muted focus:outline-none focus:border-fg focus:ring-1 focus:ring-fg/10 transition-colors", placeholder: `${campo}` }) }, `${originalIndex}-${campo}`))), _jsx("td", { className: "px-4 py-2 text-center border-l border-border", children: _jsx("button", { type: "button", onClick: () => removerLinhaImportada(displayIndex), className: "text-muted hover:text-fg text-lg leading-none transition-colors", children: "\u00D7" }) })] }, originalIndex));
                                            }) })] }) }), totalPagesImportados > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [_jsx("button", { type: "button", onClick: () => setCurrentPageImportados(Math.max(1, currentPageImportados - 1)), disabled: currentPageImportados === 1, className: "px-3 py-1 border border-border rounded-sm text-12px font-500 text-fg hover:bg-input disabled:opacity-30 transition-colors", children: "\u2190 Anterior" }), _jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: totalPagesImportados }, (_, i) => (_jsx("button", { type: "button", onClick: () => setCurrentPageImportados(i + 1), className: `px-2 py-1 rounded-sm text-12px font-500 transition-colors ${currentPageImportados === i + 1
                                                ? 'bg-fg text-card-bg'
                                                : 'border border-border text-fg hover:bg-input'}`, children: i + 1 }, i + 1))) }), _jsx("button", { type: "button", onClick: () => setCurrentPageImportados(Math.min(totalPagesImportados, currentPageImportados + 1)), disabled: currentPageImportados === totalPagesImportados, className: "px-3 py-1 border border-border rounded-sm text-12px font-500 text-fg hover:bg-input disabled:opacity-30 transition-colors", children: "Pr\u00F3xima \u2192" })] }))] }))] }), dadosImportados.length > 0 && (_jsx("div", { className: "pt-6 border-t border-border", children: _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-14px font-500 text-fg mb-3", children: "Registros adicionados manualmente" }), _jsx("div", { className: "overflow-x-auto border border-border rounded-sm bg-card-bg mb-4", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-input border-b border-border", children: [_jsx("th", { className: "w-12 px-4 py-2 text-left text-12px font-600 text-fg", children: "#" }), campos.map((campo) => (_jsx("th", { className: "min-w-32 px-4 py-2 text-left text-12px font-600 text-fg border-l border-border", children: campo }, campo))), _jsx("th", { className: "w-10 px-4 py-2 text-center text-12px font-600 text-fg border-l border-border", children: "\u2014" })] }) }), _jsx("tbody", { children: currentDataAdicionados.map((linha, displayIndex) => {
                                            const originalIndex = startIdxAdicionados + displayIndex;
                                            return (_jsxs("tr", { className: "hover:bg-input border-b border-border", children: [_jsx("td", { className: "px-4 py-2 text-12px text-muted", children: dadosImportados.length + originalIndex + 1 }), campos.map((campo) => (_jsx("td", { className: "px-3 py-2 border-l border-border", children: _jsx("input", { type: "text", value: linha[campo] || '', onChange: (e) => handleCellChangeAdicionados(displayIndex, campo, e.target.value), className: "w-full px-2 py-1 text-14px border border-border rounded-sm bg-card-bg text-fg placeholder:text-muted focus:outline-none focus:border-fg focus:ring-1 focus:ring-fg/10 transition-colors", placeholder: `${campo}` }) }, `${originalIndex}-${campo}`))), _jsx("td", { className: "px-4 py-2 text-center border-l border-border", children: _jsx("button", { type: "button", onClick: () => removerLinhaAdicionada(displayIndex), disabled: dadosAdicionados.length === 1, className: "text-muted hover:text-fg disabled:opacity-30 text-lg leading-none transition-colors", children: "\u00D7" }) })] }, originalIndex));
                                        }) })] }) }), totalPagesAdicionados > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [_jsx("button", { type: "button", onClick: () => setCurrentPageAdicionados(Math.max(1, currentPageAdicionados - 1)), disabled: currentPageAdicionados === 1, className: "px-3 py-1 border border-border rounded-sm text-12px font-500 text-fg hover:bg-input disabled:opacity-30 transition-colors", children: "\u2190 Anterior" }), _jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: totalPagesAdicionados }, (_, i) => (_jsx("button", { type: "button", onClick: () => setCurrentPageAdicionados(i + 1), className: `px-2 py-1 rounded-sm text-12px font-500 transition-colors ${currentPageAdicionados === i + 1
                                            ? 'bg-fg text-card-bg'
                                            : 'border border-border text-fg hover:bg-input'}`, children: i + 1 }, i + 1))) }), _jsx("button", { type: "button", onClick: () => setCurrentPageAdicionados(Math.min(totalPagesAdicionados, currentPageAdicionados + 1)), disabled: currentPageAdicionados === totalPagesAdicionados, className: "px-3 py-1 border border-border rounded-sm text-12px font-500 text-fg hover:bg-input disabled:opacity-30 transition-colors", children: "Pr\u00F3xima \u2192" })] })), _jsx("button", { type: "button", onClick: adicionarLinha, className: "px-4 py-2 text-14px font-500 text-fg border border-border rounded-sm hover:bg-input transition-colors", children: "+ Adicionar linha" })] }) })), dadosImportados.length === 0 && (_jsxs("div", { children: [_jsx("div", { className: "overflow-x-auto border border-border rounded-sm bg-card-bg mb-4", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-input border-b border-border", children: [_jsx("th", { className: "w-12 px-4 py-2 text-left text-12px font-600 text-fg", children: "#" }), campos.map((campo) => (_jsx("th", { className: "min-w-32 px-4 py-2 text-left text-12px font-600 text-fg border-l border-border", children: campo }, campo))), _jsx("th", { className: "w-10 px-4 py-2 text-center text-12px font-600 text-fg border-l border-border", children: "\u2014" })] }) }), _jsx("tbody", { children: currentDataAdicionados.map((linha, displayIndex) => {
                                        const originalIndex = startIdxAdicionados + displayIndex;
                                        return (_jsxs("tr", { className: "hover:bg-input border-b border-border", children: [_jsx("td", { className: "px-4 py-2 text-12px text-muted", children: originalIndex + 1 }), campos.map((campo) => (_jsx("td", { className: "px-3 py-2 border-l border-border", children: _jsx("input", { type: "text", value: linha[campo] || '', onChange: (e) => handleCellChangeAdicionados(displayIndex, campo, e.target.value), className: "w-full px-2 py-1 text-14px border border-border rounded-sm bg-card-bg text-fg placeholder:text-muted focus:outline-none focus:border-fg focus:ring-1 focus:ring-fg/10 transition-colors", placeholder: `${campo}` }) }, `${originalIndex}-${campo}`))), _jsx("td", { className: "px-4 py-2 text-center border-l border-border", children: _jsx("button", { type: "button", onClick: () => removerLinhaAdicionada(displayIndex), disabled: dadosAdicionados.length === 1, className: "text-muted hover:text-fg disabled:opacity-30 text-lg leading-none transition-colors", children: "\u00D7" }) })] }, originalIndex));
                                    }) })] }) }), totalPagesAdicionados > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [_jsx("button", { type: "button", onClick: () => setCurrentPageAdicionados(Math.max(1, currentPageAdicionados - 1)), disabled: currentPageAdicionados === 1, className: "px-3 py-1 border border-border rounded-sm text-12px font-500 text-fg hover:bg-input disabled:opacity-30 transition-colors", children: "\u2190 Anterior" }), _jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: totalPagesAdicionados }, (_, i) => (_jsx("button", { type: "button", onClick: () => setCurrentPageAdicionados(i + 1), className: `px-2 py-1 rounded-sm text-12px font-500 transition-colors ${currentPageAdicionados === i + 1
                                        ? 'bg-fg text-card-bg'
                                        : 'border border-border text-fg hover:bg-input'}`, children: i + 1 }, i + 1))) }), _jsx("button", { type: "button", onClick: () => setCurrentPageAdicionados(Math.min(totalPagesAdicionados, currentPageAdicionados + 1)), disabled: currentPageAdicionados === totalPagesAdicionados, className: "px-3 py-1 border border-border rounded-sm text-12px font-500 text-fg hover:bg-input disabled:opacity-30 transition-colors", children: "Pr\u00F3xima \u2192" })] })), _jsx("button", { type: "button", onClick: adicionarLinha, className: "px-4 py-2 text-14px font-500 text-fg border border-border rounded-sm hover:bg-input transition-colors", children: "+ Adicionar linha" })] }))] }));
}
