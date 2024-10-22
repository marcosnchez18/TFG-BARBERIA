import React from 'react';
import { Link } from '@inertiajs/react';

export default function Naviser() {
    return (
        <nav className="bg-neutral-900 p-4">
            <div className="container mx-auto flex flex-wrap justify-between items-center">
                {/* Logo de la Barbería */}
                <div>
                    <Link href={route('home')}>
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
                            <Link href={route('home')} className="text-xl md:text-3xl text-white hover:text-gray-400">
                                Home
                            </Link>
                        </li>

                        <li>
                            <a href={route('sobre-nosotros')} className="text-xl md:text-3xl text-white hover:text-gray-400">Sobre Nosotros</a>
                        </li>
                        <li>
                        <a href={route('contacto')} className="text-xl md:text-3xl text-white hover:text-gray-400">Contacto</a>
                        </li>
                    </ul>
                </div>

                {/* Botones de Iniciar sesión y Registrarse */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 font-serif mt-4 md:mt-0">
                    <Link href="/login" className="text-lg md:text-xl text-white hover:text-gray-400">
                        Iniciar sesión
                    </Link>
                    <Link href="/register" className="text-lg md:text-xl text-white hover:text-gray-400">
                        Registrarse
                    </Link>
                </div>
            </div>
        </nav>
    );
}
