import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function NavigationCliente() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { post } = useForm();

    // Función para manejar la confirmación de cierre de sesión
    const handleLogout = () => {
        post(route('logout'), {
            onSuccess: () => window.location.href = route('home'), // Redirige a /home después de cerrar sesión
        });
    };

    return (
        <nav className="bg-neutral-900 p-4">
            <div className="container mx-auto flex flex-wrap justify-between items-center">
                {/* Logo de la Barbería */}
                <div>
                    <Link href={route('mi-cuenta')}>
                        <img
                            src="/images/logo.png"
                            alt="Logo Barbería"
                            className="w-30 h-30 md:w-40 md:h-30"
                        />
                    </Link>
                </div>

                {/* Menú de navegación */}
                <div className="bg-neutral-800 p-4 md:p-10 rounded-lg shadow-md font-serif w-full md:w-auto mt-4 md:mt-0">
                    <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <li>
                            {/* Enlace de Home con confirmación de cierre de sesión */}
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="text-xl md:text-3xl text-white hover:text-gray-400"
                            >
                                Home
                            </button>
                        </li>

                    </ul>
                </div>
            </div>

            {/* Modal de confirmación de cierre de sesión */}
            {showLogoutModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <p className="text-xl font-semibold mb-6">¿Estás seguro que quieres cerrar sesión?</p>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-4"
                        >
                            Sí, cerrar sesión
                        </button>
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            No, permanecer
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
