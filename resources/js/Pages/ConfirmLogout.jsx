import React from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function ConfirmLogout() {
    const handleLogout = () => {
        // Enviar solicitud POST a la ruta de cierre de sesión
        Inertia.post('/logout');
    };

    const handleCancel = () => {
        // Regresar al dashboard si el usuario cancela
        Inertia.visit('/dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-semibold mb-4">¿Seguro que deseas cerrar sesión?</h2>
                <p className="mb-6">Serás redirigido a la página principal si cierras sesión.</p>
                <div className="space-x-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        Sí, cerrar sesión
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400">
                        No, permanecer en mi cuenta
                    </button>
                </div>
            </div>
        </div>
    );
}
