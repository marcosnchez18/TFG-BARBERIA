import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import { Link, router } from '@inertiajs/react';

export default function EditarServicios({ servicios }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentService, setCurrentService] = useState(null);
    const [step, setStep] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;


    const eliminarServicio = (id) => {
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
            Inertia.delete(route('servicios.destroy', id), {
                onSuccess: (page) => {
                    // Verificar si hay un mensaje de error en la sesión
                    if (page.props.flash.error) {
                        Swal.fire('Error', page.props.flash.error, 'error');
                    } else {
                        Swal.fire('Eliminado', 'Servicio eliminado con éxito.', 'success');
                    }
                },
                onError: (errors) => {
                    Swal.fire('Error', 'Hubo un problema al eliminar el servicio.', 'error');
                },
            });
        }
    });
};


    const editarServicio = (servicio) => {
        setCurrentService(servicio);
        setStep(1);
    };

    const handleSaveChanges = () => {
        // Validación de los campos antes de proceder
        if (!validarCampos()) return;

        Inertia.patch(route('servicios.update', currentService.id), {
            nombre: currentService.nombre,
            descripcion: currentService.descripcion,
            precio: currentService.precio,
            duracion: currentService.duracion
        }, {
            onSuccess: () => {
                Swal.fire('Guardado', 'Servicio actualizado con éxito.', 'success');
                setCurrentService(null);
            },
            onError: () => {
                Swal.fire('Error', 'Hubo un problema al actualizar el servicio', 'error');
            }
        });
    };

    const handleInputChange = (e) => {
        setCurrentService({
            ...currentService,
            [e.target.name]: e.target.value
        });
    };

    const validarCampos = () => {
        // Validar nombre
        if (!currentService.nombre) {
            Swal.fire('Campo obligatorio', 'El nombre del servicio es obligatorio.', 'warning');
            return false;
        }

        // Validar descripción
        if (!currentService.descripcion) {
            Swal.fire('Campo obligatorio', 'La descripción es obligatoria.', 'warning');
            return false;
        }

        // Validar precio
        if (isNaN(currentService.precio) || currentService.precio <= 0) {
            Swal.fire('Precio inválido', 'El precio debe ser un número positivo.', 'warning');
            return false;
        }

        // Validar duración (entero positivo)
        if (!Number.isInteger(Number(currentService.duracion)) || currentService.duracion <= 0) {
            Swal.fire('Duración inválida', 'La duración debe ser un número entero positivo.', 'warning');
            return false;
        }

        return true;
    };

    const filteredServicios = servicios.filter(servicio =>
        servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cálculo de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentServicios = filteredServicios.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.max(1, Math.ceil(filteredServicios.length / itemsPerPage));

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };


    return (
        <div
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <NavigationAdmin />
            <br /><br /><br />
            <div className="clientes-admin-container p-6 rounded-lg relative w-full mx-auto mt-20" style={{ backgroundColor: 'rgba(23, 23, 23, 0.8)', maxWidth: '1700px' }}>
    <div className="absolute top-4 right-4">
        <Link href="/opciones" className="text-white text-xl font-bold hover:text-gray-300">✕</Link>
    </div>
                <h2 className="text-4xl font-bold mb-8 text-center text-white">Gestión de Servicios</h2>

                <div className="clientes-admin-search mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre de servicio..."
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
                                <th className="clientes-admin-table-header">Descripción</th>
                                <th className="clientes-admin-table-header">Precio</th>
                                <th className="clientes-admin-table-header">Duración</th>
                                <th className="clientes-admin-table-header text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
    {currentServicios.map((servicio) => (
        <tr key={servicio.id} className="clientes-admin-table-row">
            <td className="clientes-admin-table-cell">{servicio.nombre}</td>
            <td className="clientes-admin-table-cell">{servicio.descripcion}</td>
            <td className="clientes-admin-table-cell">{servicio.precio} €</td>
            <td className="clientes-admin-table-cell">{servicio.duracion} min</td>
            <td className="clientes-admin-table-cell text-center space-x-2">
                <button
                    onClick={() => editarServicio(servicio)}
                    className="clientes-admin-btn-edit"
                >
                    ✏️
                </button>
                <button
                    onClick={() => eliminarServicio(servicio.id)}
                    className="clientes-admin-btn-delete"
                >
                    🗑️
                </button>
            </td>
        </tr>
    ))}
</tbody>

                    </table>
                    <div className="flex justify-center mt-4 space-x-4">
    <button
        onClick={prevPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
    >
        ◀️ Anterior
    </button>

    <span className="text-white">Página {currentPage} de {totalPages}</span>

    <button
        onClick={nextPage}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 rounded ${currentPage >= totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
    >
        Siguiente ▶️
    </button>
</div>

                </div>

                {/* Modal de Edición */}
                {currentService && (
                    <div className="clientes-admin-edit-modal mt-8">
                        <h3 className="text-2xl font-bold mb-4 text-white">Editar Servicio</h3>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            {step === 1 && (
                                <div>
                                    <label className="block text-white">Nombre:</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={currentService.nombre}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded mb-4 bg-gray-100"
                                    />
                                    <button onClick={() => setStep(2)} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Siguiente</button>
                                </div>
                            )}
                            {step === 2 && (
                                <div>
                                    <label className="block text-white">Descripción:</label>
                                    <textarea
                                        name="descripcion"
                                        value={currentService.descripcion}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded mb-4 bg-gray-100"
                                    ></textarea>
                                    <button onClick={() => setStep(3)} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Siguiente</button>
                                    <button onClick={() => setStep(1)} className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 ml-2">Anterior</button>
                                </div>
                            )}
                            {step === 3 && (
                                <div>
                                    <label className="block text-white">Precio (€):</label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={currentService.precio}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded mb-4 bg-gray-100"
                                    />
                                    <button onClick={() => setStep(4)} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Siguiente</button>
                                    <button onClick={() => setStep(2)} className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 ml-2">Anterior</button>
                                </div>
                            )}
                            {step === 4 && (
                                <div>
                                    <label className="block text-white">Duración (minutos):</label>
                                    <input
                                        type="number"
                                        name="duracion"
                                        value={currentService.duracion}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded mb-4 bg-gray-100"
                                    />
                                    <button onClick={handleSaveChanges} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Guardar Cambios</button>
                                    <button onClick={() => setStep(3)} className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 ml-2">Anterior</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
