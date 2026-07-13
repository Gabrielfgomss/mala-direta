import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import TemplateInput from './TemplateInput';
import ValuesInput from './ValuesInput';
import ValuesTable from './ValuesTable';
import DocxInput from './DocxInput';
import ExcelInput from './ExcelInput';
import GenerateButton from './GenerateButton';
import FeedbackModal from './FeedbackModal';
import ProgressBar from './ProgressBar';
import { gerarZip, gerarZipDocx, gerarZipBoth, gerarPdfComFallback, extrairCampos } from '../lib/gerador';
export default function ToolSection() {
    const [template, setTemplate] = useState('');
    const [values, setValues] = useState('');
    const [docxArrayBuffer, setDocxArrayBuffer] = useState(null);
    const [campos, setCampos] = useState([]);
    const [valoresTabela, setValoresTabela] = useState([]);
    const [formato, setFormato] = useState('docx');
    const [showFeedback, setShowFeedback] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [progress, setProgress] = useState(0);
    const handleDocxLoaded = (arrayBuffer) => {
        setDocxArrayBuffer(arrayBuffer);
        try {
            const zip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                syntax: {
                    allowUnopenedTag: true,
                    allowUnclosedTag: true
                }
            });
            const conteudo = doc.getFullText();
            const camposExtraidos = extrairCampos(conteudo);
            setCampos(camposExtraidos);
        }
        catch (error) {
            console.error('Erro ao ler .docx:', error);
            alert('Erro ao ler o arquivo .docx');
        }
    };
    const handleGenerate = async () => {
        try {
            setShowProgress(true);
            setProgress(0);
            if (docxArrayBuffer) {
                if (valoresTabela.length === 0 || Object.keys(valoresTabela[0]).length === 0) {
                    alert('Preencha pelo menos uma linha de valores');
                    setShowProgress(false);
                    return;
                }
                if (formato === 'docx') {
                    await gerarZipDocx(valoresTabela, docxArrayBuffer, setProgress);
                }
                else if (formato === 'pdf') {
                    await gerarPdfComFallback(valoresTabela, docxArrayBuffer, setProgress);
                }
                else if (formato === 'ambos') {
                    await gerarZipBoth(valoresTabela, docxArrayBuffer, setProgress);
                }
                setShowProgress(false);
                setShowFeedback(true);
                return;
            }
            const linhas = values.trim().split('\n').filter(linha => linha.trim() !== '');
            if (linhas.length === 0) {
                alert('Adicione pelo menos uma linha de valores');
                setShowProgress(false);
                return;
            }
            if (template.trim() === '') {
                alert('Adicione um template');
                setShowProgress(false);
                return;
            }
            await gerarZip(linhas, template, setProgress);
            setShowProgress(false);
            setShowFeedback(true);
        }
        catch (error) {
            console.error('Erro ao gerar arquivos:', error);
            alert('Erro ao gerar arquivos. Tente novamente.');
            setShowProgress(false);
        }
    };
    return (_jsxs("section", { className: "bg-bg transition-colors duration-200 py-12 md:py-8 px-6", children: [_jsx(ProgressBar, { progress: progress, isVisible: showProgress, message: "Gerando arquivos..." }), _jsx(FeedbackModal, { isOpen: showFeedback, onClose: () => setShowFeedback(false) }), _jsx("div", { className: "max-w-800px mx-auto", children: _jsxs("form", { onSubmit: (e) => { e.preventDefault(); handleGenerate(); }, className: "space-y-6", children: [_jsxs("div", { className: "card-section p-6 transition-colors duration-200", children: [_jsx("h2", { className: "text-18px font-600 text-fg mb-4", children: "1. Escolha o template" }), _jsxs("div", { className: "space-y-4", children: [_jsx(DocxInput, { onFileLoaded: handleDocxLoaded, campos: campos }), !docxArrayBuffer && (_jsxs("div", { className: "text-center py-4 border-t border-border", children: [_jsx("p", { className: "text-12px text-muted mb-4", children: "ou" }), _jsx(TemplateInput, { value: template, onChange: setTemplate, disabled: !!docxArrayBuffer })] }))] })] }), (template || docxArrayBuffer) && (_jsxs("div", { className: "card-section p-6 transition-colors duration-200", children: [_jsx("h2", { className: "text-18px font-600 text-fg mb-4", children: "2. Preencha os valores" }), campos.length > 0 && (_jsxs("div", { className: "mb-4 p-3 bg-input rounded-sm border border-border", children: [_jsx("p", { className: "text-12px font-500 text-muted mb-2", children: "Campos detectados:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: campos.map((campo) => (_jsx("span", { className: "px-3 py-1 bg-fg text-card-bg rounded-sm text-12px font-500", children: campo }, campo))) })] })), campos.length === 0 ? (_jsx(ValuesInput, { value: values, onChange: setValues })) : (_jsxs(_Fragment, { children: [_jsx(ValuesTable, { campos: campos, onChange: setValoresTabela, initialData: valoresTabela }), _jsx("div", { className: "mt-6 pt-6 border-t border-border", children: _jsx(ExcelInput, { onDataLoaded: setValoresTabela, campos: campos }) })] }))] })), (template || docxArrayBuffer) && (_jsxs("div", { className: "card-section p-6 transition-colors duration-200", children: [_jsx("h2", { className: "text-18px font-600 text-fg mb-4", children: "3. Formato de sa\u00EDda" }), _jsxs("div", { className: "flex gap-6", children: [_jsxs("label", { className: "flex items-center cursor-pointer", children: [_jsx("input", { type: "radio", value: "docx", checked: formato === 'docx', onChange: (e) => setFormato(e.target.value), className: "w-4 h-4 text-fg" }), _jsx("span", { className: "ml-3 text-14px font-400 text-fg", children: "DOCX" })] }), _jsxs("label", { className: "flex items-center cursor-pointer", children: [_jsx("input", { type: "radio", value: "pdf", checked: formato === 'pdf', onChange: (e) => setFormato(e.target.value), className: "w-4 h-4 text-fg" }), _jsx("span", { className: "ml-3 text-14px font-400 text-fg", children: "PDF" })] }), _jsxs("label", { className: "flex items-center cursor-pointer", children: [_jsx("input", { type: "radio", value: "ambos", checked: formato === 'ambos', onChange: (e) => setFormato(e.target.value), className: "w-4 h-4 text-fg" }), _jsx("span", { className: "ml-3 text-14px font-400 text-fg", children: "DOCX + PDF" })] })] })] })), (template || docxArrayBuffer) && (_jsx(GenerateButton, { onClick: handleGenerate }))] }) })] }));
}
