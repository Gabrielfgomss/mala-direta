import { useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { extrairCampos } from '../lib/gerador';

interface DocxInputProps {
  onFileLoaded: (arrayBuffer: ArrayBuffer) => void;
  campos?: string[];
}

export default function DocxInput({ onFileLoaded, campos = [] }: DocxInputProps) {
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNomeArquivo(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;

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
      } catch (error) {
        console.error('Erro ao ler .docx:', error);
        alert('Arquivo .docx inválido');
        setNomeArquivo(null);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <label className="block text-14px font-500 text-foreground mb-3">
        Ou faça upload de um arquivo .docx
      </label>
      <input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        className="w-full px-3 py-2 border border-border rounded-sm bg-white text-14px cursor-pointer hover:border-foreground/30 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-colors"
      />

      {nomeArquivo && (
        <div className="mt-3 p-3 bg-white border border-border rounded-sm">
          <p className="text-14px text-foreground mb-2">
            ✓ Arquivo: <strong>{nomeArquivo}</strong>
          </p>
          {campos.length > 0 && (
            <p className="text-12px text-muted">
              Campos: {campos.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
