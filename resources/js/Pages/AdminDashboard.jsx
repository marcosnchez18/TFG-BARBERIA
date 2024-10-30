import React from 'react';
import { usePage } from '@inertiajs/react';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
export default function AdminDashboard() {
    const { user, citasHoy, nuevosUsuariosHoy, gananciasMes, nombreMesActual } = usePage().props;

    return (
        <div className="admin-dashboard bg-gray-100 min-h-screen">
            <NavigationAdmin admin={true} />

            <div className="container mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-[#A87B43]">¡Bienvenido de Nuevo, {user.nombre}!</h1>
                    <p className="text-lg text-gray-600 mt-2">Panel de Control del Administrador</p>
                </header>

                {/* Sección de bienvenida y estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Estadísticas rápidas */}
                    <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Estadísticas Rápidas</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="stat bg-[#F7ECE3] p-4 rounded-lg text-center">
                                <p className="text-xl font-semibold text-[#A87B43]">Citas Hoy</p>
                                <span className="text-3xl font-bold">{citasHoy}</span>
                            </div>
                            <div className="stat bg-[#E7F3F3] p-4 rounded-lg text-center">
                                <p className="text-xl font-semibold text-[#4A7A7C]">Nuevos Usuarios</p>
                                <span className="text-3xl font-bold">{nuevosUsuariosHoy}</span>
                            </div>
                            <div className="stat bg-[#EFE3F0] p-4 rounded-lg text-center">
                                <p className="text-xl font-semibold text-[#A87B43]">Ganancias de {nombreMesActual}</p>
                                <span className="text-3xl font-bold">€{gananciasMes}</span>
                            </div>
                            <div className="stat bg-[#F3F1E4] p-4 rounded-lg text-center">
                                <p className="text-xl font-semibold text-[#A87B43]">Total Citas Hoy</p>
                                <span className="text-3xl font-bold">{citasHoy}</span>
                            </div>
                        </div>
                    </div>

                    {/* Mensaje de bienvenida */}
                    <div className="welcome-message bg-[#A87B43] text-white rounded-lg p-8 shadow-md flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">¡Listo para empezar el día!</h2>
                            <p className="text-lg mt-4">Aquí puedes gestionar citas, usuarios, y revisar estadísticas para optimizar el flujo de trabajo.</p>
                            <button className="mt-6 px-4 py-2 bg-white text-[#A87B43] rounded-full font-semibold hover:bg-[#E6D6C3]">
                                Ver Más Detalles
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sección de acciones rápidas */}
                <div className="quick-actions mt-12">
                    <h2 className="text-3xl font-semibold text-gray-700 mb-6">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="action-card bg-gray-50 p-6 rounded-lg shadow-md text-center hover:bg-[#F4EFE8] transition">
                            <h3 className="text-xl font-bold text-gray-700">Gestionar Citas</h3>
                            <p className="text-gray-600 mt-2">Revisa y organiza las citas de los clientes.</p>
                            <button className="mt-4 px-4 py-2 bg-[#A87B43] text-white rounded-md">Ir a Citas</button>
                        </div>
                        <div className="action-card bg-gray-50 p-6 rounded-lg shadow-md text-center hover:bg-[#E6D6C3] transition">
                            <h3 className="text-xl font-bold text-gray-700">Ver Estadísticas</h3>
                            <p className="text-gray-600 mt-2">Consulta estadísticas y reportes financieros.</p>
                            <button className="mt-4 px-4 py-2 bg-[#A87B43] text-white rounded-md">Ir a Reportes</button>
                        </div>
                        <div className="action-card bg-gray-50 p-6 rounded-lg shadow-md text-center hover:bg-[#F4EFE8] transition">
                            <h3 className="text-xl font-bold text-gray-700">Gestionar Usuarios</h3>
                            <p className="text-gray-600 mt-2">Actualiza y organiza el listado de usuarios.</p>
                            <button className="mt-4 px-4 py-2 bg-[#A87B43] text-white rounded-md">Ir a Usuarios</button>
                        </div>
                    </div>
                </div>
            </div>
            <SobreNosotros />
            <Footer />
        </div>
    );
}
