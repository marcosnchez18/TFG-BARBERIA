import '../../css/Barber.css';
import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function NavigationAdmin() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { post } = useForm();

    // Función para manejar la confirmación de cierre de sesión
    const handleLogout = () => {
        post(route('logout'), {
            onSuccess: () => window.location.href = route('home'),
        });
    };

    return (
        <nav className="bg-neutral-900 p-4">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo de la Barbería (Izquierda) */}
                <div className="flex items-center">
                <button onClick={() => setShowLogoutModal(true)}>
                        <img
                            src="/images/logo.png"
                            alt="Logo Barbería"
                            className="w-20 h-20 md:w-30 md:h-30"
                        />
                    </button>
                </div>

                {/* Icono de menú hamburguesa (Visible en pantallas pequeñas) */}
                <button
                    className="text-white text-3xl md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                {/* Menú de navegación */}
                <div
                    className={`${
                        isMenuOpen ? 'block' : 'hidden'
                    } md:flex md:flex-row space-y-4 md:space-y-0 md:space-x-8 mt-4 md:mt-0 mx-auto`}
                    style={{ fontFamily: 'Times New Roman, serif' }}
                >
                    {/* Opciones en vertical cuando está el menú hamburguesa */}
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                    <button onClick={() => setShowLogoutModal(true)} className="text-lg md:text-xl text-white hover:text-gray-400 flex items-center nav-item-hover">
                             Home
                        </button>
                        <Link href={route('mi-gestion-admin')} className="text-lg md:text-xl text-white hover:text-gray-400 nav-item-hover">Estadísticas</Link>
                        <Link href={route('admin-citas')} className="text-lg md:text-xl text-white hover:text-gray-400 nav-item-hover">Próximas Citas</Link>
                        <Link href={route('admin-foro')} className="text-lg md:text-xl text-white hover:text-gray-400 nav-item-hover">Foro</Link>
                        <Link href={route('admin-clientes')} className="text-lg md:text-xl text-white hover:text-gray-400 nav-item-hover">Clientes</Link>
                        <button onClick={() => setShowLogoutModal(true)} className="text-lg md:text-xl text-white hover:text-gray-400 flex items-center nav-item-hover">
                            <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de cierre de sesión */}
            {showLogoutModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <p className="text-xl font-semibold mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>¿Estás seguro que quieres cerrar sesión?</p>
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
