import { useState } from 'react';

interface PaginatedValuesListProps {
  dados: Record<string, string>[];
  campos: string[];
}

const ITEMS_PER_PAGE = 10;

export default function PaginatedValuesList({ dados, campos }: PaginatedValuesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dados.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentData = dados.slice(startIdx, endIdx);

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-12px font-500 text-muted">
          Mostrando {startIdx + 1} a {Math.min(endIdx, dados.length)} de {dados.length} linhas
        </p>
      </div>

      {/* Tabela compacta */}
      <div className="overflow-x-auto border border-border rounded-sm bg-card-bg mb-3">
        <table className="w-full text-12px">
          <thead>
            <tr className="bg-input border-b border-border">
              {campos.map((campo) => (
                <th key={campo} className="px-3 py-2 text-left font-600 text-fg">
                  {campo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIdx) => (
              <tr key={startIdx + rowIdx} className="border-b border-border hover:bg-input">
                {campos.map((campo) => (
                  <td key={`${startIdx + rowIdx}-${campo}`} className="px-3 py-1 text-fg truncate">
                    {row[campo] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-border rounded-sm text-12px font-500 text-fg hover:bg-input disabled:opacity-30 transition-colors"
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 py-1 rounded-sm text-12px font-500 transition-colors ${
                  currentPage === i + 1
                    ? 'bg-fg text-card-bg'
                    : 'border border-border text-fg hover:bg-input'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-border rounded-sm text-12px font-500 text-fg hover:bg-input disabled:opacity-30 transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
