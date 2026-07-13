import { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === null) {
      alert('Por favor, selecione uma avaliação');
      return;
    }

    // Log feedback (pode ser enviado para um backend depois)
    console.log('Feedback:', { rating, message, timestamp: new Date().toISOString() });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setRating(null);
      setMessage('');
      setSubmitted(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 transition-colors duration-200">
      <div className="bg-card-bg rounded-sm shadow-lg p-8 max-w-400px mx-4 transition-colors duration-200">
        {!submitted ? (
          <>
            <h3 className="text-18px font-600 text-fg mb-4">Como foi sua experiência?</h3>

            {/* Rating */}
            <div className="mb-6">
              <p className="text-14px font-500 text-fg mb-3">Avaliação</p>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-28px cursor-pointer transition-transform ${
                      rating === star ? 'scale-125' : 'scale-100'
                    }`}
                  >
                    {rating && star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <p className="text-14px font-500 text-fg mb-2">Comentário (opcional)</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="O que você achou? Dicas para melhorar?"
                className="w-full px-3 py-2 border border-border rounded-sm bg-card-bg text-14px font-400 text-fg placeholder:text-muted focus:outline-none focus:border-fg focus:ring-1 focus:ring-fg/10 transition-colors"
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-sm text-14px font-500 text-fg hover:bg-input transition-colors"
              >
                Pular
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-fg text-card-bg rounded-sm text-14px font-600 hover:opacity-90 transition-opacity"
              >
                Enviar
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-16px font-600 text-fg">✓ Obrigado!</p>
            <p className="text-12px text-muted mt-2">Seu feedback ajuda a melhorar</p>
          </div>
        )}
      </div>
    </div>
  );
}
