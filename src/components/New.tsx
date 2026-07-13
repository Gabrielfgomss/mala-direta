import React, { useState, changeEvent } from 'react';
import JSZip from 'jszip';

interface ZipFileItem {
  name: string;
  relativePath: string;
  entry: JSZip.JSZipObject;
}

interface FolderStructureNode {
  id: string;
  path: string; // Caminho completo ex: "Grupo ABC/1. Documentos"
}

interface RoutingRule {
  id: string;
  type: 'contains' | 'starts' | 'ends' | 'equals' | 'wildcard';
  pattern: string;
  targetFolderId: string;
}

export default function FileOrganizer() {
  const [sourceFiles, setSourceFiles] = useState<ZipFileItem[]>([]);
  const [zipName, setZipName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estados para a Criação de Estrutura de Pastas
  const [rootFolderName, setRootFolderName] = useState<string>('Grupo ABC');
  const [namingType, setNamingType] = useState<'list' | 'numeric'>('list');
  const [textList, setTextList] = useState<string>('Documentos, Processos, Petições');
  const [prefixSuffixPattern, setPrefixSuffixPattern] = useState<string>('{index}. {texto}');
  const [numericCount, setNumericCount] = useState<number>(3);
  
  // Estado das Subpastas Geradas de forma dinâmica
  const [generatedFolders, setGeneratedFolders] = useState<FolderStructureNode[]>([]);
  
  // Estado das Regras de Movimentação
  const [rules, setRules] = useState<RoutingRule[]>([]);

  // 1. Ler o Arquivo ZIP usando JSZip
  const handleZipUpload = async (e: changeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setZipName(file.name);

    try {
      const zip = await JSZip.loadAsync(file);
      const filesArray: ZipFileItem[] = [];

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
    } catch (error) {
      console.error("Erro ao ler o arquivo ZIP:", error);
      alert("Erro ao processar o arquivo ZIP. Certifique-se de que é um arquivo válido.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Lógica Inteligente para Gerar as Pastas com base nos inputs (Melhor UX para Leigos)
  const generateFolders = () => {
    const temporaryFolders: FolderStructureNode[] = [];
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
    } else {
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
    const newRule: RoutingRule = {
      id: crypto.randomUUID(),
      type: 'contains',
      pattern: '',
      targetFolderId: generatedFolders[0]?.id || ''
    };
    setRules([...rules], newRule);
  };

  // Validar se o nome do arquivo corresponde à regra usando Wildcards ou texto simples
  const matchFile = (fileName: string, type: string, pattern: string): boolean => {
    if (!pattern) return false;
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
    if (sourceFiles.length === 0) return;
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="mx-auto max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
        
        {/* Header - Identidade Minimalista e Corporativa */}
        <div className="bg-slate-900 px-6 py-5 text-white flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Organizador Inteligente de Arquivos</h1>
            <p className="text-xs text-slate-400 mt-1">Padronize sua estrutura jurídica e salve direto no ZIP</p>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
            Mala Direta v2.0
          </span>
        </div>

        <div className="p-6 space-y-8">
          
          {/* PASSO 1: Upload do Arquivo ZIP */}
          <section className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-semibold">
              <span className="bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
              <h2>Selecione o Arquivo ZIP de Origem</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center px-4 py-3 bg-white text-slate-700 rounded-lg shadow-sm border border-slate-300 cursor-pointer hover:bg-slate-50 transition duration-200">
                <span className="text-sm font-medium">Escolher Arquivo .ZIP</span>
                <input type="file" accept=".zip" className="hidden" onChange={handleZipUpload} />
              </label>
              
              {zipName && (
                <div className="text-sm text-slate-600">
                  Arquivo carregado: <strong className="text-slate-900">{zipName}</strong> ({sourceFiles.length} arquivos encontrados)
                </div>
              )}
            </div>
          </section>

          {/* PASSO 2: Criação Automática da Estrutura de Pastas */}
          <section className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-semibold">
              <span className="bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
              <h2>Definir Padrão das Pastas Destino</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nome da Pasta Raiz (Mãe)</label>
                <input 
                  type="text" 
                  value={rootFolderName} 
                  onChange={(e) => setRootFolderName(e.target.value)} 
                  className="w-full p-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-slate-500 text-sm" 
                  placeholder="Ex: Grupo ABC"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Padrão do Nome das Subpastas</label>
                <select 
                  value={prefixSuffixPattern} 
                  onChange={(e) => setPrefixSuffixPattern(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-slate-500 text-sm"
                >
                  <option value="{index}. {texto}">1. Documentos (Igual Excel)</option>
                  <option value="{index}_{texto}">1_Nome</option>
                  <option value="CPF_{texto}">CPF_Nome</option>
                  <option value="{texto}_CPF">Nome_CPF</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200 space-y-3">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input type="radio" checked={namingType === 'list'} onChange={() => setNamingType('list')} className="text-slate-900" />
                  <span>Criar por lista de nomes separados por vírgula</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input type="radio" checked={namingType === 'numeric'} onChange={() => setNamingType('numeric')} className="text-slate-900" />
                  <span>Criar por ordem numérica progressiva</span>
                </label>
              </div>

              {namingType === 'list' ? (
                <div>
                  <textarea 
                    value={textList}
                    onChange={(e) => setTextList(e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-slate-300 rounded-md text-sm"
                    placeholder="Documentos, Processos, Petições, Contratos"
                  />
                  <p className="text-xs text-slate-500 mt-0.5">Digite os nomes separados por vírgula.</p>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Quantidade de pastas a criar:</span>
                  <input 
                    type="number" 
                    value={numericCount} 
                    onChange={(e) => setNumericCount(Number(e.target.value))} 
                    className="w-20 p-1.5 border border-slate-300 rounded-md text-sm" 
                    min={1} 
                  />
                </div>
              )}

              <button 
                type="button" 
                onClick={generateFolders}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded hover:bg-slate-700 transition"
              >
                Gerar/Atualizar Estrutura
              </button>
            </div>

            {/* Visualização em tempo real da árvore de pastas */}
            {generatedFolders.length > 0 && (
              <div className="bg-slate-900 text-slate-300 p-3.5 rounded-md text-xs font-mono space-y-1">
                <div className="text-emerald-400 font-bold">📁 Estrutura que será criada no ZIP:</div>
                {generatedFolders.map((f) => (
                  <div key={f.id} className="pl-4">└── 📁 {f.path}</div>
                ))}
              </div>
            )}
          </section>

          {/* PASSO 3: Regras Inteligentes para Mover Arquivos */}
          <section className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-slate-900 font-semibold">
                <span className="bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span>
                <h2>Regras para Organização dos Arquivos</h2>
              </div>
              <button 
                type="button" 
                onClick={addRule}
                disabled={generatedFolders.length === 0}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition disabled:opacity-50"
              >
                + Adicionar Regra
              </button>
            </div>

            {/* Dica amigável de Wildcards para usuários leigos */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 text-xs text-amber-900 rounded-r-md">
              💡 <strong>Como funciona o caractere coringa (*):</strong> Se você escolher a opção <em>Coringa</em> e digitar <code>*peticao*</code>, o sistema moverá qualquer arquivo que tenha a palavra "peticao" no meio do nome.
            </div>

            {rules.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4 bg-white rounded border border-dashed border-slate-300">
                Nenhuma regra criada. Arquivos sem regras permanecerão na pasta raiz.
              </p>
            ) : (
              <div className="space-y-3">
                {rules.map((rule, idx) => (
                  <div key={rule.id} className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-md border border-slate-200 text-sm shadow-sm">
                    <span className="font-semibold text-xs bg-slate-200 px-2 py-1 rounded text-slate-700">Regra #{idx + 1}</span>
                    
                    <span className="text-slate-600">Se o arquivo</span>
                    <select 
                      value={rule.type} 
                      onChange={(e) => {
                        const newRules = [...rules];
                        newRules[idx].type = e.target.value as any;
                        setRules(newRules);
                      }}
                      className="p-1.5 border border-slate-300 rounded text-xs bg-slate-50"
                    >
                      <option value="contains">Contiver o termo</option>
                      <option value="starts">Começar com</option>
                      <option value="ends">Terminar com</option>
                      <option value="equals">For exatamente igual a</option>
                      <option value="wildcard">Usar Coringa (*)</option>
                    </select>

                    <input 
                      type="text" 
                      value={rule.pattern}
                      onChange={(e) => {
                        const newRules = [...rules];
                        newRules[idx].pattern = e.target.value;
                        setRules(newRules);
                      }}
                      placeholder="Ex: CPF ou termo*"
                      className="p-1.5 border border-slate-300 rounded text-xs flex-1 min-w-[150px]"
                    />

                    <span className="text-slate-600">mover para:</span>
                    <select 
                      value={rule.targetFolderId}
                      onChange={(e) => {
                        const newRules = [...rules];
                        newRules[idx].targetFolderId = e.target.value;
                        setRules(newRules);
                      }}
                      className="p-1.5 border border-slate-300 rounded text-xs bg-slate-50"
                    >
                      {generatedFolders.map(f => (
                        <option key={f.id} value={f.id}>{f.path.split('/').pop()}</option>
                      ))}
                    </select>

                    <button 
                      type="button" 
                      onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                      className="text-red-500 hover:text-red-700 font-medium text-xs ml-auto px-2 py-1"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* EXECUTAR OPERAÇÃO */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={handleProcessAndDownload}
              disabled={isLoading || sourceFiles.length === 0}
              className="w-full md:w-auto px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 transition duration-200 text-sm disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span>Processando e compactando...</span>
              ) : (
                <span>Organizar Estrutura e Baixar Novo ZIP</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
