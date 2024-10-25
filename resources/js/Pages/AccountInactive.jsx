import React from 'react';

export default function AccountInactive({ message }) {
    return (
        <div className="account-inactive-container mx-auto text-center p-12 min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-800 to-black">
            <h2 className="account-inactive-title text-4xl md:text-6xl font-extrabold text-red-500 mb-6">
                💈​Cuenta Deshabilitada💈​
            </h2>
            <p className="account-inactive-message text-2xl md:text-3xl text-white mb-4 px-4 md:px-8 max-w-3xl leading-relaxed">
                {message}
            </p>
            <p className="account-inactive-contact text-lg md:text-xl text-gray-300 mt-6">
                ¿Tienes preguntas?{' '}
                <a href="/contacto" className="text-blue-400 underline hover:text-blue-600 transition duration-300">
                    Contáctanos
                </a> y resolveremos tus dudas.
            </p>
            <div className="account-inactive-decorative mt-10">
                <img src="/images/logo.png" alt="Decorative Graphic" className="w-32 md:w-48 opacity-75" />
            </div>
        </div>
    );
}
