import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';

export default function ClientesAdmin({ clientes }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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







    const verFicha = async (id) => {
        try {
            const response = await fetch(route('clientes.ficha', id));
            if (!response.ok) {
                throw new Error('Error al obtener la ficha del cliente');
            }
            const ficha = await response.json();
            setSelectedCliente(ficha);
            setIsModalOpen(true);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo cargar la ficha del cliente.', 'error');
        }
    };



    const cerrarModal = () => {
        setSelectedCliente(null);
        setIsModalOpen(false);
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
                                <th className="clientes-admin-table-header text-center px-4 py-2">Nombre</th>
                                <th className="clientes-admin-table-header text-center px-4 py-2">Correo</th>
                                <th className="clientes-admin-table-header text-center px-4 py-2">Número de Tarjeta</th>
                                <th className="clientes-admin-table-header text-center px-4 py-2">Saldo</th>
                                <th className="clientes-admin-table-header text-center px-4 py-2">Citas Completadas</th>
                                <th className="clientes-admin-table-header text-center px-4 py-2">Citas Ausentes</th>
                                <th className="clientes-admin-table-header text-center px-4 py-2">Estado</th>
                                <th className="clientes-admin-table-header text-center px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClientes.map((cliente) => (
                                <tr key={cliente.id} className="clientes-admin-table-row">
                                    {/* Nombre del cliente */}
                                    <td className="clientes-admin-table-cell text-center">{cliente.nombre}</td>

                                    {/* Correo del cliente */}
                                    <td className="clientes-admin-table-cell text-center">{cliente.email}</td>

                                    {/* Número de tarjeta */}
                                    <td className="clientes-admin-table-cell text-center">{cliente.numero_tarjeta_vip}</td>

                                    {/* Saldo */}
                                    <td className="clientes-admin-table-cell text-center">{cliente.saldo} €</td>

                                    {/* Citas completadas */}
                                    <td className="clientes-admin-table-cell text-center">
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold">
                                            {cliente.citas_completadas}
                                        </div>
                                    </td>

                                    {/* Citas ausentes */}
                                    <td className="clientes-admin-table-cell text-center">
                                        {cliente.citas_ausentes === 0 ? (
                                            <div className="text-blue-500 font-bold">
                                                Sin ausencias
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-start space-x-4">
                                                {/* Círculo rojo con el número de ausencias */}
                                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white font-bold">
                                                    {cliente.citas_ausentes}
                                                </div>
                                                {/* Lista de fechas sin viñetas */}
                                                <div className="text-left">
                                                    {cliente.fechas_ausentes?.map((fecha, index) => {
                                                        // Convertir la fecha a formato 'dd/mm/yyyy'
                                                        const dateObj = new Date(fecha);
                                                        const day = String(dateObj.getDate()).padStart(2, '0');
                                                        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
                                                        const year = dateObj.getFullYear();
                                                        const formattedDate = `${day}/${month}/${year}`;
                                                        return <div key={index}>{formattedDate}</div>;
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </td>






                                    {/* Estado */}
                                    <td className="clientes-admin-table-cell text-center">{cliente.estado}</td>

                                    {/* Acciones */}
                                    <td className="clientes-admin-table-cell text-center">
                                        <div className="flex justify-center items-center space-x-2">
                                            {/* Botón Ver ficha */}
                                            <button
                                                onClick={() => verFicha(cliente.id)}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                                title="Ver ficha"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>

                                            {/* Botón Eliminar cliente */}
                                            <button
                                                onClick={() => eliminarCliente(cliente.id)}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                                                title="Eliminar"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>

                                            {/* Botón Deshabilitar/Habilitar cliente */}
                                            {cliente.estado === 'activo' ? (
                                                <button
                                                    onClick={() => deshabilitarCliente(cliente.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                    title="Deshabilitar"
                                                >
                                                    <i className="fas fa-ban"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => habilitarCliente(cliente.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    title="Habilitar"
                                                >
                                                    <i className="fas fa-check"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>


                    </table>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        {/* Modal Container */}
                        <div className="bg-gradient-to-br from-gray-100 to-white rounded-xl shadow-2xl w-11/12 max-w-4xl relative p-8 max-h-[90vh] overflow-y-auto">
                            {/* Botón de cierre */}
                            <button
                                onClick={cerrarModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>

                            {/* Título */}
                            <h2 className="text-3xl font-bold text-yellow-600 text-center mb-6">Ficha del Cliente</h2>
                            {/* Imagen del Cliente */}
                            <div className="flex justify-center mb-6">
                                {selectedCliente?.imagen ? (
                                    <img
                                        src={`/storage/${selectedCliente.imagen}`} // Ruta completa a la imagen
                                        alt="Foto del cliente"
                                        className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-gray-300 flex items-center justify-center bg-gray-200">
                                        <span className="text-gray-500">Sin imagen</span>
                                    </div>
                                )}
                            </div>

                            {/* Contenido con filas y subfilas */}
                            <div className="space-y-6">
                                {/* Sección de Color y Tinte */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Color y Tinte</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        {/* Color */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Color:</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                {selectedCliente?.color || 'No especificado'}
                                            </p>
                                        </div>

                                        {/* Tinte */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">¿Usa tinte?</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                {selectedCliente?.tinte ? 'Sí' : 'No'}
                                            </p>
                                        </div>

                                        {/* Colores usados */}
                                        {selectedCliente?.tinte && (
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-medium text-gray-600">Colores usados:</label>
                                                <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                    {selectedCliente?.colores_usados?.length > 0
                                                        ? selectedCliente.colores_usados.join(', ')
                                                        : 'No especificado'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sección de Pelo */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Características del Pelo</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        {/* Tipo de pelo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Tipo de pelo:</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                {selectedCliente?.tipo_pelo || 'No especificado'}
                                            </p>
                                        </div>

                                        {/* Textura */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Textura:</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                {selectedCliente?.textura || 'No especificado'}
                                            </p>
                                        </div>

                                        {/* Canas */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Canas:</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                {selectedCliente?.canas || 'No especificado'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección de Barba */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Características de la Barba</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        {/* Barba */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">¿Tiene barba?</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                {selectedCliente?.barba ? 'Sí' : 'No'}
                                            </p>
                                        </div>

                                        {/* Tipo de barba */}
                                        {selectedCliente?.barba && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Tipo de barba:</label>
                                                <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                    {selectedCliente?.tipo_barba || 'No especificado'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sección de Rostro */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Características del Rostro</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        {/* Tipo de rostro */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Tipo de rostro:</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                {selectedCliente?.tipo_rostro || 'No especificado'}
                                            </p>
                                        </div>

                                        {/* Tipo de corte */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Tipo de corte:</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                {selectedCliente?.tipo_corte || 'No especificado'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección de Otros Detalles */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Otros Detalles</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        {/* Injerto capilar */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">¿Tiene injerto capilar?</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                {selectedCliente?.injerto_capilar ? 'Sí' : 'No'}
                                            </p>
                                        </div>

                                        {/* Estado del cuero cabelludo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Estado del cuero cabelludo:</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner">
                                                {selectedCliente?.estado || 'No especificado'}
                                            </p>
                                        </div>

                                        {/* Deseos */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600">Deseos:</label>
                                            <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner whitespace-pre-wrap">
                                                {selectedCliente?.deseos || 'No especificado'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}



            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
