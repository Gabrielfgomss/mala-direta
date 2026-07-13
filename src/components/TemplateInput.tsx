interface TemplateInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TemplateInput({ value, onChange, disabled = false }: TemplateInputProps) {
  return (
    <div>
      <label className="block text-14px font-500 text-fg mb-3">
        Template (texto puro com {'{'}campo{'}'})
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Olá {{nome}},&#10;&#10;Seu CPF é: {{cpf}}&#10;&#10;Processo: {{processo}}"
        className={`w-full h-48 px-3 py-2 border border-border rounded-sm bg-card-bg text-14px font-400 text-fg placeholder:text-muted focus:outline-none focus:border-fg focus:ring-1 focus:ring-fg/10 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  )
}
