import React from 'react';
import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div>
            {/* Barra de navegación */}
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-2xl">Barbería</div>
                    <ul className="flex space-x-4">
                        <li><a href="#home" className="text-white hover:text-gray-400">Inicio</a></li>
                        <li><a href="#services" className="text-white hover:text-gray-400">Servicios</a></li>
                        <li><a href="#about" className="text-white hover:text-gray-400">Nosotros</a></li>
                    </ul>
                    <div className="flex space-x-4">
                        {/* Botón de Iniciar Sesión */}
                        <Link href="/login" className="text-white hover:text-gray-400">
                            Iniciar sesión
                        </Link>
                        {/* Botón de Registrarse */}
                        <Link href="/register" className="text-white hover:text-gray-400">
                            Registrarse
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Sección de bienvenida */}
            <header id="home" className="bg-cover bg-center h-screen" style={{ backgroundImage: "url('/images/barberia.jpg')" }}>
                <div className="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center text-white text-center p-4">
                    <h1 className="text-4xl font-bold">Bienvenido a Barbería</h1>
                    <p className="mt-4 text-lg">El mejor lugar para un corte de pelo perfecto y un ambiente relajante.</p>
                    <Link href="/login" className="mt-8 bg-white text-black px-4 py-2 rounded-md">
                        Iniciar sesión
                    </Link>
                </div>
            </header>

            {/* Sección de información sobre la barbería */}
            <section id="about" className="py-12 bg-gray-100 text-center">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Sobre Nosotros</h2>
                    <p className="text-lg text-gray-700">Somos una barbería con años de experiencia brindando el mejor servicio. Nuestro equipo está listo para hacer que te veas y te sientas increíble.</p>
                    <p className="text-lg text-gray-700 mt-4">Horario de atención: Lunes a Sábado, 10:00 AM - 8:00 PM</p>
                    <p className="text-lg text-gray-700 mt-4">Ubicación: Calle Ejemplo, Ciudad, País</p>
                </div>
            </section>

            {/* Sección de servicios */}
            <section id="services" className="py-12 bg-white text-center">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Nuestros Servicios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-100 rounded-md shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Corte de Pelo</h3>
                            <p>Cortes de alta calidad adaptados a tu estilo personal.</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-md shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Afeitado Clásico</h3>
                            <p>Afeitado tradicional con navaja para una experiencia relajante.</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-md shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Arreglo de Barba</h3>
                            <p>Cuida tu barba con un estilo definido y profesional.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto text-center">
                    <p>© 2024 Barbería. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
