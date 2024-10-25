import React from 'react';

export default function AccountInactive({ message }) {
    return (
        <div className="container mx-auto text-center p-8">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Cuenta Deshabilitada</h1>
            <p className="text-xl text-gray-700">{message}</p>
            <p className="mt-4 text-gray-500">
                Si tienes alguna pregunta, no dudes en <a href="/contacto" className="text-blue-500 underline">contactarnos</a>.
            </p>
        </div>
    );
}
