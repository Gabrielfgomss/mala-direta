interface GenerateButtonProps {
  onClick: () => void;
}

export default function GenerateButton({ onClick }: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-6 py-3 bg-foreground text-white font-600 text-16px rounded-sm hover:bg-black/90 active:bg-black/80 transition-colors"
    >
      ⬇ Gerar e baixar
    </button>
  )
}
