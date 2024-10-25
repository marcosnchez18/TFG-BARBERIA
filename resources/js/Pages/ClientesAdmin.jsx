import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import NavigationAdmin from '../Components/NavigationAdmin';

export default function ClientesAdmin({ clientes }) {

    const eliminarCliente = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            Inertia.delete(route('clientes.destroy', id), {
                onSuccess: () => alert('Cliente eliminado con éxito'),
            });
        }
    };

    const deshabilitarCliente = (id) => {
        if (confirm('¿Deseas deshabilitar este cliente?')) {
            Inertia.patch(route('clientes.deshabilitar', id), {
                onSuccess: () => alert('Cliente deshabilitado con éxito'),
            });
        }
    };

    const habilitarCliente = (id) => {
        if (confirm('¿Deseas habilitar este cliente?')) {
            Inertia.patch(route('clientes.habilitar', id), {
                onSuccess: () => alert('Cliente habilitado con éxito'),
            });
        }
    };

    return (
        <div>
            <NavigationAdmin />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold mb-8">Gestión Épica de Clientes</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-blue-900 text-left uppercase text-sm font-bold">
                                <th className="py-3 px-6">Nombre</th>
                                <th className="py-3 px-6">Correo</th>
                                <th className="py-3 px-6">Número de Tarjeta</th>
                                <th className="py-3 px-6">Saldo</th>
                                <th className="py-3 px-6">Ausencias</th>
                                <th className="py-3 px-6 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => (
                                <tr key={cliente.id} className="hover:bg-gray-700">
                                    <td className="py-4 px-6">{cliente.nombre}</td>
                                    <td className="py-4 px-6">{cliente.email}</td>
                                    <td className="py-4 px-6">{cliente.numero_tarjeta_vip}</td>
                                    <td className="py-4 px-6">{cliente.saldo} €</td>
                                    <td className="py-4 px-6 text-center">{cliente.contador_ausencias}</td>
                                    <td className="py-4 px-6 text-center space-x-2">
                                        <button
                                            onClick={() => eliminarCliente(cliente.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                                        >
                                            🗑️
                                        </button>
                                        {cliente.estado === 'activo' ? (
                                            <button
                                                onClick={() => deshabilitarCliente(cliente.id)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full"
                                            >
                                                Deshabilitar
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => habilitarCliente(cliente.id)}
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                                            >
                                                Habilitar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
