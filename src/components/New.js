import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import JSZip from 'jszip';
export default function FileOrganizer() {
    const [sourceFiles, setSourceFiles] = useState([]);
    const [zipName, setZipName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Estados para a Criação de Estrutura de Pastas
    const [rootFolderName, setRootFolderName] = useState('Grupo ABC');
    const [namingType, setNamingType] = useState('list');
    const [textList, setTextList] = useState('Documentos, Processos, Petições');
    const [prefixSuffixPattern, setPrefixSuffixPattern] = useState('{index}. {texto}');
    const [numericCount, setNumericCount] = useState(3);
    // Estado das Subpastas Geradas de forma dinâmica
    const [generatedFolders, setGeneratedFolders] = useState([]);
    // Estado das Regras de Movimentação
    const [rules, setRules] = useState([]);
    // 1. Ler o Arquivo ZIP usando JSZip
    const handleZipUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setIsLoading(true);
        setZipName(file.name);
        try {
            const zip = await JSZip.loadAsync(file);
            const filesArray = [];
            zip.forEach((relativePath, zipEntry) => {
                if (!zipEntry.dir) {
                    filesArray.push({
                        name: zipEntry.name.split('/').pop() || zipEntry.name,
                        relativePath,
                        entry: zipEntry,
                    });
                }
            });
            setSourceFiles(filesArray);
            generateFolders(); // Gera a estrutura inicial automaticamente
        }
        catch (error) {
            console.error("Erro ao ler o arquivo ZIP:", error);
            alert("Erro ao processar o arquivo ZIP. Certifique-se de que é um arquivo válido.");
        }
        finally {
            setIsLoading(false);
        }
    };
    // 2. Lógica Inteligente para Gerar as Pastas com base nos inputs (Melhor UX para Leigos)
    const generateFolders = () => {
        const temporaryFolders = [];
        const baseRoot = rootFolderName.trim() || 'Principal';
        if (namingType === 'list') {
            const items = textList.split(',').map(item => item.trim()).filter(Boolean);
            items.forEach((item, index) => {
                // Substitui os marcadores dinâmicos solicitados
                let folderName = prefixSuffixPattern
                    .replace('{texto}', item)
                    .replace('{index}', (index + 1).toString())
                    .replace('{CPF}', 'CPF_Exemplo');
                temporaryFolders.push({
                    id: `folder-${index}`,
                    path: `${baseRoot}/${folderName}`
                });
            });
        }
        else {
            for (let i = 1; i <= numericCount; i++) {
                let folderName = prefixSuffixPattern
                    .replace('{texto}', `Pasta`)
                    .replace('{index}', i.toString());
                temporaryFolders.push({
                    id: `folder-num-${i}`,
                    path: `${baseRoot}/${folderName}`
                });
            }
        }
        setGeneratedFolders(temporaryFolders);
    };
    // Adicionar uma nova regra de roteamento de arquivos
    const addRule = () => {
        const newRule = {
            id: crypto.randomUUID(),
            type: 'contains',
            pattern: '',
            targetFolderId: generatedFolders[0]?.id || ''
        };
        setRules([...rules], newRule);
    };
    // Validar se o nome do arquivo corresponde à regra usando Wildcards ou texto simples
    const matchFile = (fileName, type, pattern) => {
        if (!pattern)
            return false;
        const lowerName = fileName.toLowerCase();
        const lowerPattern = pattern.toLowerCase();
        switch (type) {
            case 'equals':
                return lowerName === lowerPattern;
            case 'starts':
                return lowerName.startsWith(lowerPattern);
            case 'ends':
                return lowerName.endsWith(lowerPattern);
            case 'contains':
                return lowerName.includes(lowerPattern);
            case 'wildcard':
                // Converte o caractere curinga '*' em uma expressão regular simples
                const regexPattern = new RegExp('^' + lowerPattern.split('*').join('.*') + '$');
                return regexPattern.test(lowerName);
            default:
                return false;
        }
    };
    // 3. Processar tudo e gerar o novo arquivo ZIP Reestruturado
    const handleProcessAndDownload = async () => {
        if (sourceFiles.length === 0)
            return;
        setIsLoading(true);
        const newZip = new JSZip();
        for (const fileItem of sourceFiles) {
            let destinationPath = `${rootFolderName}/${fileItem.name}`; // Destino padrão na raiz
            let matched = false;
            // Percorre as regras configuradas pelo usuário para encontrar um match
            for (const rule of rules) {
                if (matchFile(fileItem.name, rule.type, rule.pattern)) {
                    const targetFolder = generatedFolders.find(f => f.id === rule.targetFolderId);
                    if (targetFolder) {
                        destinationPath = `${targetFolder.path}/${fileItem.name}`;
                        matched = true;
                        break; // Aplica a primeira regra correspondente
                    }
                }
            }
            // Se não encontrou nenhuma regra e há pastas criadas, podemos mandar para a primeira como fallback ou manter na raiz
            const fileData = await fileItem.entry.async('blob');
            newZip.file(destinationPath, fileData);
        }
        // Gera o ZIP final e baixa no navegador
        const content = await newZip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `ORGANIZADO_${zipName || 'arquivos.zip'}`;
        link.click();
        setIsLoading(false);
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-50 p-6 font-sans text-slate-800", children: _jsxs("div", { className: "mx-auto max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200", children: [_jsxs("div", { className: "bg-slate-900 px-6 py-5 text-white flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold tracking-tight", children: "Organizador Inteligente de Arquivos" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Padronize sua estrutura jur\u00EDdica e salve direto no ZIP" })] }), _jsx("span", { className: "bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20", children: "Mala Direta v2.0" })] }), _jsxs("div", { className: "p-6 space-y-8", children: [_jsxs("section", { className: "bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-2 text-slate-900 font-semibold", children: [_jsx("span", { className: "bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs", children: "1" }), _jsx("h2", { children: "Selecione o Arquivo ZIP de Origem" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("label", { className: "flex flex-col items-center justify-center px-4 py-3 bg-white text-slate-700 rounded-lg shadow-sm border border-slate-300 cursor-pointer hover:bg-slate-50 transition duration-200", children: [_jsx("span", { className: "text-sm font-medium", children: "Escolher Arquivo .ZIP" }), _jsx("input", { type: "file", accept: ".zip", className: "hidden", onChange: handleZipUpload })] }), zipName && (_jsxs("div", { className: "text-sm text-slate-600", children: ["Arquivo carregado: ", _jsx("strong", { className: "text-slate-900", children: zipName }), " (", sourceFiles.length, " arquivos encontrados)"] }))] })] }), _jsxs("section", { className: "bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-2 text-slate-900 font-semibold", children: [_jsx("span", { className: "bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs", children: "2" }), _jsx("h2", { children: "Definir Padr\u00E3o das Pastas Destino" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1", children: "Nome da Pasta Raiz (M\u00E3e)" }), _jsx("input", { type: "text", value: rootFolderName, onChange: (e) => setRootFolderName(e.target.value), className: "w-full p-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-slate-500 text-sm", placeholder: "Ex: Grupo ABC" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1", children: "Padr\u00E3o do Nome das Subpastas" }), _jsxs("select", { value: prefixSuffixPattern, onChange: (e) => setPrefixSuffixPattern(e.target.value), className: "w-full p-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-slate-500 text-sm", children: [_jsx("option", { value: "{index}. {texto}", children: "1. Documentos (Igual Excel)" }), _jsx("option", { value: "{index}_{texto}", children: "1_Nome" }), _jsx("option", { value: "CPF_{texto}", children: "CPF_Nome" }), _jsx("option", { value: "{texto}_CPF", children: "Nome_CPF" })] })] })] }), _jsxs("div", { className: "bg-white p-4 rounded-md border border-slate-200 space-y-3", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("label", { className: "flex items-center space-x-2 text-sm text-slate-700 cursor-pointer", children: [_jsx("input", { type: "radio", checked: namingType === 'list', onChange: () => setNamingType('list'), className: "text-slate-900" }), _jsx("span", { children: "Criar por lista de nomes separados por v\u00EDrgula" })] }), _jsxs("label", { className: "flex items-center space-x-2 text-sm text-slate-700 cursor-pointer", children: [_jsx("input", { type: "radio", checked: namingType === 'numeric', onChange: () => setNamingType('numeric'), className: "text-slate-900" }), _jsx("span", { children: "Criar por ordem num\u00E9rica progressiva" })] })] }), namingType === 'list' ? (_jsxs("div", { children: [_jsx("textarea", { value: textList, onChange: (e) => setTextList(e.target.value), rows: 2, className: "w-full p-2 border border-slate-300 rounded-md text-sm", placeholder: "Documentos, Processos, Peti\u00E7\u00F5es, Contratos" }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Digite os nomes separados por v\u00EDrgula." })] })) : (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Quantidade de pastas a criar:" }), _jsx("input", { type: "number", value: numericCount, onChange: (e) => setNumericCount(Number(e.target.value)), className: "w-20 p-1.5 border border-slate-300 rounded-md text-sm", min: 1 })] })), _jsx("button", { type: "button", onClick: generateFolders, className: "px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded hover:bg-slate-700 transition", children: "Gerar/Atualizar Estrutura" })] }), generatedFolders.length > 0 && (_jsxs("div", { className: "bg-slate-900 text-slate-300 p-3.5 rounded-md text-xs font-mono space-y-1", children: [_jsx("div", { className: "text-emerald-400 font-bold", children: "\uD83D\uDCC1 Estrutura que ser\u00E1 criada no ZIP:" }), generatedFolders.map((f) => (_jsxs("div", { className: "pl-4", children: ["\u2514\u2500\u2500 \uD83D\uDCC1 ", f.path] }, f.id)))] }))] }), _jsxs("section", { className: "bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-2 text-slate-900 font-semibold", children: [_jsx("span", { className: "bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs", children: "3" }), _jsx("h2", { children: "Regras para Organiza\u00E7\u00E3o dos Arquivos" })] }), _jsx("button", { type: "button", onClick: addRule, disabled: generatedFolders.length === 0, className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition disabled:opacity-50", children: "+ Adicionar Regra" })] }), _jsxs("div", { className: "bg-amber-50 border-l-4 border-amber-500 p-3 text-xs text-amber-900 rounded-r-md", children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "Como funciona o caractere coringa (*):" }), " Se voc\u00EA escolher a op\u00E7\u00E3o ", _jsx("em", { children: "Coringa" }), " e digitar ", _jsx("code", { children: "*peticao*" }), ", o sistema mover\u00E1 qualquer arquivo que tenha a palavra \"peticao\" no meio do nome."] }), rules.length === 0 ? (_jsx("p", { className: "text-sm text-slate-500 text-center py-4 bg-white rounded border border-dashed border-slate-300", children: "Nenhuma regra criada. Arquivos sem regras permanecer\u00E3o na pasta raiz." })) : (_jsx("div", { className: "space-y-3", children: rules.map((rule, idx) => (_jsxs("div", { className: "flex flex-wrap items-center gap-2 bg-white p-3 rounded-md border border-slate-200 text-sm shadow-sm", children: [_jsxs("span", { className: "font-semibold text-xs bg-slate-200 px-2 py-1 rounded text-slate-700", children: ["Regra #", idx + 1] }), _jsx("span", { className: "text-slate-600", children: "Se o arquivo" }), _jsxs("select", { value: rule.type, onChange: (e) => {
                                                    const newRules = [...rules];
                                                    newRules[idx].type = e.target.value;
                                                    setRules(newRules);
                                                }, className: "p-1.5 border border-slate-300 rounded text-xs bg-slate-50", children: [_jsx("option", { value: "contains", children: "Contiver o termo" }), _jsx("option", { value: "starts", children: "Come\u00E7ar com" }), _jsx("option", { value: "ends", children: "Terminar com" }), _jsx("option", { value: "equals", children: "For exatamente igual a" }), _jsx("option", { value: "wildcard", children: "Usar Coringa (*)" })] }), _jsx("input", { type: "text", value: rule.pattern, onChange: (e) => {
                                                    const newRules = [...rules];
                                                    newRules[idx].pattern = e.target.value;
                                                    setRules(newRules);
                                                }, placeholder: "Ex: CPF ou termo*", className: "p-1.5 border border-slate-300 rounded text-xs flex-1 min-w-[150px]" }), _jsx("span", { className: "text-slate-600", children: "mover para:" }), _jsx("select", { value: rule.targetFolderId, onChange: (e) => {
                                                    const newRules = [...rules];
                                                    newRules[idx].targetFolderId = e.target.value;
                                                    setRules(newRules);
                                                }, className: "p-1.5 border border-slate-300 rounded text-xs bg-slate-50", children: generatedFolders.map(f => (_jsx("option", { value: f.id, children: f.path.split('/').pop() }, f.id))) }), _jsx("button", { type: "button", onClick: () => setRules(rules.filter(r => r.id !== rule.id)), className: "text-red-500 hover:text-red-700 font-medium text-xs ml-auto px-2 py-1", children: "Remover" })] }, rule.id))) }))] }), _jsx("div", { className: "pt-4 border-t border-slate-200 flex justify-end", children: _jsx("button", { type: "button", onClick: handleProcessAndDownload, disabled: isLoading || sourceFiles.length === 0, className: "w-full md:w-auto px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 transition duration-200 text-sm disabled:opacity-50 flex items-center justify-center space-x-2", children: isLoading ? (_jsx("span", { children: "Processando e compactando..." })) : (_jsx("span", { children: "Organizar Estrutura e Baixar Novo ZIP" })) }) })] })] }) }));
}
