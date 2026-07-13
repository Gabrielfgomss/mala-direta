interface ProgressBarProps {
  progress: number; // 0-100
  isVisible: boolean;
  message?: string;
}

export default function ProgressBar({ progress, isVisible, message }: ProgressBarProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-200">
      <div className="bg-card-bg rounded-sm shadow-lg p-8 max-w-400px mx-4 transition-colors duration-200">
        <p className="text-14px font-600 text-fg mb-4 text-center">
          {message || 'Gerando arquivos...'}
        </p>

        {/* Barra de progresso */}
        <div className="w-full h-2 bg-input rounded-sm overflow-hidden mb-4">
          <div
            className="h-full bg-fg transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentual */}
        <p className="text-12px font-500 text-muted text-center">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
