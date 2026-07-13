import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
export default function FeedbackModal({ isOpen, onClose }) {
    const [rating, setRating] = useState(null);
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
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-40 transition-colors duration-200", children: _jsx("div", { className: "bg-card-bg rounded-sm shadow-lg p-8 max-w-400px mx-4 transition-colors duration-200", children: !submitted ? (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-18px font-600 text-fg mb-4", children: "Como foi sua experi\u00EAncia?" }), _jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-14px font-500 text-fg mb-3", children: "Avalia\u00E7\u00E3o" }), _jsx("div", { className: "flex gap-3", children: [1, 2, 3, 4, 5].map((star) => (_jsx("button", { onClick: () => setRating(star), className: `text-28px cursor-pointer transition-transform ${rating === star ? 'scale-125' : 'scale-100'}`, children: rating && star <= rating ? '⭐' : '☆' }, star))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-14px font-500 text-fg mb-2", children: "Coment\u00E1rio (opcional)" }), _jsx("textarea", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "O que voc\u00EA achou? Dicas para melhorar?", className: "w-full px-3 py-2 border border-border rounded-sm bg-card-bg text-14px font-400 text-fg placeholder:text-muted focus:outline-none focus:border-fg focus:ring-1 focus:ring-fg/10 transition-colors", rows: 3 })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onClose, className: "flex-1 px-4 py-2 border border-border rounded-sm text-14px font-500 text-fg hover:bg-input transition-colors", children: "Pular" }), _jsx("button", { onClick: handleSubmit, className: "flex-1 px-4 py-2 bg-fg text-card-bg rounded-sm text-14px font-600 hover:opacity-90 transition-opacity", children: "Enviar" })] })] })) : (_jsxs("div", { className: "text-center py-6", children: [_jsx("p", { className: "text-16px font-600 text-fg", children: "\u2713 Obrigado!" }), _jsx("p", { className: "text-12px text-muted mt-2", children: "Seu feedback ajuda a melhorar" })] })) }) }));
}
