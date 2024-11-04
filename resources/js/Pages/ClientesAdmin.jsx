import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';

export default function ClientesAdmin({ clientes }) {
    const [searchTerm, setSearchTerm] = useState('');

    const eliminarCliente = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción no se puede deshacer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(route('clientes.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Eliminado', 'Cliente eliminado con éxito.', 'success');
                    },
                });
            }
        });
    };

    const deshabilitarCliente = (id) => {
        Swal.fire({
            title: '¿Deseas deshabilitar este cliente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, deshabilitar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.patch(route('clientes.deshabilitar', id), {
                    onSuccess: () => {
                        Swal.fire('Deshabilitado', 'Cliente deshabilitado con éxito.', 'success');
                    },
                });
            }
        });
    };

    const habilitarCliente = (id) => {
        Swal.fire({
            title: '¿Deseas habilitar este cliente?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, habilitar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.patch(route('clientes.habilitar', id), {
                    onSuccess: () => {
                        Swal.fire('Habilitado', 'Cliente habilitado con éxito.', 'success');
                    },
                });
            }
        });
    };

    const filteredClientes = clientes.filter(cliente =>
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                paddingBottom: '2rem',
            }}
        >
            <NavigationAdmin />
            <br /><br /><br />
            <div className="clientes-admin-container p-6 rounded-lg" style={{ backgroundColor: 'rgba(23, 23, 23, 0.8)' }}>
                <h2 className="text-4xl font-bold mb-8 text-center text-white">Gestión de Clientes</h2>

                <div className="clientes-admin-search mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por correo electrónico..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="clientes-admin-search-input w-full p-2 border rounded"
                    />
                </div>

                <div className="clientes-admin-table-container">
                    <table className="clientes-admin-table w-full">
                        <thead>
                            <tr>
                                <th className="clientes-admin-table-header">Nombre</th>
                                <th className="clientes-admin-table-header">Correo</th>
                                <th className="clientes-admin-table-header">Número de Tarjeta</th>
                                <th className="clientes-admin-table-header">Saldo</th>
                                <th className="clientes-admin-table-header">Ausencias</th>
                                <th className="clientes-admin-table-header text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClientes.map((cliente) => (
                                <tr key={cliente.id} className="clientes-admin-table-row">
                                    <td className="clientes-admin-table-cell">{cliente.nombre}</td>
                                    <td className="clientes-admin-table-cell">{cliente.email}</td>
                                    <td className="clientes-admin-table-cell">{cliente.numero_tarjeta_vip}</td>
                                    <td className="clientes-admin-table-cell">{cliente.saldo} €</td>
                                    <td className="clientes-admin-table-cell text-center">{cliente.contador_ausencias}</td>
                                    <td className="clientes-admin-table-cell text-center space-x-2">
                                        <button
                                            onClick={() => eliminarCliente(cliente.id)}
                                            className="clientes-admin-btn-delete"
                                        >
                                            🗑️
                                        </button>
                                        {cliente.estado === 'activo' ? (
                                            <button
                                                onClick={() => deshabilitarCliente(cliente.id)}
                                                className="clientes-admin-btn-disable"
                                            >
                                                Deshabilitar
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => habilitarCliente(cliente.id)}
                                                className="clientes-admin-btn-enable"
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
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
