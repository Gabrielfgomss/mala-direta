export default function Footer() {
  return (
    <footer className="border-t border-border bg-card-bg transition-colors duration-200">
      <div className="max-w-full px-6 py-8 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <p className="text-12px font-400 text-muted">
            Feito por Gabriel Macário · João Pessoa/PB · 2026
          </p>
          <a
            href="#"
            className="text-12px font-500 text-fg hover:text-muted transition-colors duration-200"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
