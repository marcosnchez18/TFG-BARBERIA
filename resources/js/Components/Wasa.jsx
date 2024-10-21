import React from 'react';

export default function WhatsAppButton() {
    const phoneNumber = '+34622541527'; // Número de teléfono de contacto
    const message = 'Hola, que tal, estoy interesado en vuestros servicios, ¿podéis ayudarme?'; // Mensaje predefinido
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button fixed bottom-4 right-4 flex items-center space-x-2 bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-green-600 transition"
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-6 h-6"
            />
            <span>¿Necesitas ayuda?</span>
        </a>
    );
}
