import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavigationAdmin from '../../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import { Link } from '@inertiajs/react';

export default function EditarProductos({ productos }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [editableId, setEditableId] = useState(null);
    const [editableField, setEditableField] = useState(null);
    const [precioProveedor, setPrecioProveedor] = useState('');

    const [editableValue, setEditableValue] = useState('');
    const [editingPhotoId, setEditingPhotoId] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [productosList, setProductosList] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Cambia según la cantidad de productos por página


    const eliminarProducto = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Tendrás que volver a activarlo en caso de habilitarlo de nuevo.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(route('productos.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Eliminado', 'Producto deshabilitado.', 'success');
                    },
                    onError: (errors) => {
                        if (errors.error) {
                            Swal.fire({
                                title: 'No se puede eliminar',
                                text: errors.error, // Mensaje específico del backend
                                icon: 'error',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Entendido'
                            });
                        } else {
                            Swal.fire('Error', 'Ocurrió un problema al eliminar el producto.', 'error');
                        }
                    }
                });
            }
        });
    };






    const validarCampos = () => {
        // Validación para campos vacíos
        if (editableValue.trim() === '') {
            Swal.fire('Error', 'Este campo no puede estar vacío.', 'error');
            return false;
        }

        // Validación para precio (debe ser un número)
        if (editableField === 'precio' && isNaN(editableValue)) {
            Swal.fire('Error', 'Por favor ingresa un precio válido.', 'error');
            return false;
        }

        if (editableField === 'precio_proveedor' && (isNaN(editableValue) || parseFloat(editableValue) <= 0)) {
            Swal.fire('Error', 'Ingrese un precio de proveedor válido.', 'error');
            return false;
        }


        // Validación para stock (no puede ser decimal ni negativo)
        if (editableField === 'stock') {
            const stockValue = parseFloat(editableValue);
            if (isNaN(stockValue) || stockValue < 0 || stockValue % 1 !== 0) {
                Swal.fire('Error', 'El stock debe ser un número entero positivo.', 'error');
                return false;
            }
        }

        return true;
    };


    const saveFieldChange = (id) => {
        // Verificar que los campos son válidos
        if (validarCampos()) {
            // Crear un objeto con el campo editable y su nuevo valor
            const data = { [editableField]: editableValue };

            // Enviar la solicitud de actualización utilizando Inertia
            Inertia.patch(route('productos.updateField', id), data, {
                onSuccess: () => {
                    // Mostrar mensaje de éxito
                    Swal.fire('Actualizado', `${editableField} actualizado con éxito.`, 'success');

                    // Restablecer el estado del formulario editable
                    setEditableId(null);
                    setEditableField(null);
                    setEditableValue('');
                },
                onError: (errors) => {
                    // Mostrar error en caso de que ocurra un fallo en la solicitud
                    Swal.fire('Error', 'Ocurrió un error al actualizar el campo.', 'error');
                }
            });
        }
    };


    useEffect(() => {
        axios.get('/api/productos')
            .then((response) => {
                setProductosList(response.data);  // Aquí asignas la respuesta al nuevo estado
            })
            .catch((error) => {
                console.error('Error al cargar productos:', error);
            });
    }, []);



    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5000000) { // 5MB máximo
            Swal.fire('Error', 'El tamaño del archivo es demasiado grande. Máximo 5MB.', 'error');
            return;
        }
        setSelectedPhoto(file);
    };

    useEffect(() => {
        // Aquí obtienes los proveedores desde una API o base de datos
        fetch('/api/proveedores')
            .then(response => response.json())
            .then(data => setProveedores(data));
    }, []);


    const savePhotoChange = (id) => {
        const formData = new FormData();
        formData.append('imagen', selectedPhoto);

        Inertia.post(route('productos.updatePhoto', id), formData, {
            onSuccess: () => {
                Swal.fire('Actualizado', 'Foto actualizada con éxito.', 'success');
                setEditingPhotoId(null);
                setSelectedPhoto(null);
            },
        });
    };

    const cancelPhotoEdit = () => {
        setEditingPhotoId(null);
        setSelectedPhoto(null);
    };

    const filteredProductos = productosList.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentProducts = filteredProductos.slice(indexOfFirstItem, indexOfLastItem);


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
            <br /><br />
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-7xl mx-auto mt-20 relative">
                <div className="absolute top-2 right-2">
                    <Link href="/opciones" className="text-black-600 text-xl font-bold hover:text-gray-400">✕</Link>
                </div>
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6">Gestión de Productos</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
                        <thead>
                            <tr className="bg-[#464242] text-white">
                                <th className="border border-gray-300 px-4 py-2">Foto</th>
                                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                                <th className="border border-gray-300 px-4 py-2">Descripción</th>
                                <th className="border border-gray-300 px-4 py-2">Precio</th>
                                <th className="border border-gray-300 px-4 py-2">Precio Proveedor</th>

                                <th className="border border-gray-300 px-4 py-2">Proveedor</th>
                                <th className="border border-gray-300 px-4 py-2">Stock</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Deshabilitar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((producto) => (
                                <tr key={producto.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {editingPhotoId === producto.id ? (
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="mb-2"
                                                />
                                                <button
                                                    onClick={() => savePhotoChange(producto.id)}
                                                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✔️
                                                </button>
                                                <button
                                                    onClick={cancelPhotoEdit}
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        ) : (
                                            <img
                                                src={producto.imagen ? `/storage/${producto.imagen}` : '/images/default-avatar.png'}
                                                alt={producto.nombre}
                                                className="rounded-full w-16 h-16 mx-auto cursor-pointer"
                                                onClick={() => setEditingPhotoId(producto.id)}
                                            />
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === producto.id && editableField === 'nombre' ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => saveFieldChange(producto.id)}
                                                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✔️
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditableId(null);
                                                        setEditableField(null);
                                                        setEditableValue('');
                                                    }}
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {producto.nombre}
                                                <button
                                                    onClick={() => {
                                                        setEditableId(producto.id);
                                                        setEditableField('nombre');
                                                        setEditableValue(producto.nombre);
                                                    }}
                                                    className="ml-2 text-blue-500"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === producto.id && editableField === 'descripcion' ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => saveFieldChange(producto.id)}
                                                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✔️
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditableId(null);
                                                        setEditableField(null);
                                                        setEditableValue('');
                                                    }}
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {producto.descripcion}
                                                <button
                                                    onClick={() => {
                                                        setEditableId(producto.id);
                                                        setEditableField('descripcion');
                                                        setEditableValue(producto.descripcion);
                                                    }}
                                                    className="ml-2 text-blue-500"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === producto.id && editableField === 'precio' ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => saveFieldChange(producto.id)}
                                                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✔️
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditableId(null);
                                                        setEditableField(null);
                                                        setEditableValue('');
                                                    }}
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {producto.precio} €
                                                <button
                                                    onClick={() => {
                                                        setEditableId(producto.id);
                                                        setEditableField('precio');
                                                        setEditableValue(producto.precio);
                                                    }}
                                                    className="ml-2 text-blue-500"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="border border-gray-300 px-4 py-2">
    {editableId === producto.id && editableField === 'precio_proveedor' ? (
        <div className="flex items-center">
            <input
                type="number"
                value={editableValue}
                onChange={(e) => setEditableValue(e.target.value)}
                className="border rounded p-1"
            />
            <button
                onClick={() => saveFieldChange(producto.id)}
                className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
            >
                ✔️
            </button>
            <button
                onClick={() => {
                    setEditableId(null);
                    setEditableField(null);
                    setEditableValue('');
                }}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
            >
                ✖️
            </button>
        </div>
    ) : (
        <div className="flex items-center">
            {producto.precio_proveedor} €
            <button
                onClick={() => {
                    setEditableId(producto.id);
                    setEditableField('precio_proveedor');
                    setEditableValue(producto.precio_proveedor);
                }}
                className="ml-2 text-blue-500"
            >
                ✏️
            </button>
        </div>
    )}
</td>


                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === producto.id && editableField === 'proveedor_id' ? (
                                            <div className="flex items-center">
                                                <select
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1 w-60"
                                                >
                                                    {/* Aquí debes asegurarte de que 'proveedores' es un array de proveedores disponibles */}
                                                    {proveedores.map((proveedor) => (
                                                        <option key={proveedor.id} value={proveedor.id}>
                                                            {proveedor.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => saveFieldChange(producto.id)}
                                                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✔️
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditableId(null);
                                                        setEditableField(null);
                                                        setEditableValue('');
                                                    }}
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {proveedores.find(proveedor => proveedor.id === producto.proveedor_id)?.nombre} {/* Mostrar el nombre del proveedor actual */}
                                                <button
                                                    onClick={() => {
                                                        setEditableId(producto.id);
                                                        setEditableField('proveedor_id');
                                                        setEditableValue(producto.proveedor_id); // Establecer el proveedor_id actual en editableValue
                                                    }}
                                                    className="ml-2 text-blue-500"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>


                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === producto.id && editableField === 'stock' ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => saveFieldChange(producto.id)}
                                                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✔️
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditableId(null);
                                                        setEditableField(null);
                                                        setEditableValue('');
                                                    }}
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {producto.stock}
                                                <button
                                                    onClick={() => {
                                                        setEditableId(producto.id);
                                                        setEditableField('stock');
                                                        setEditableValue(producto.stock);
                                                    }}
                                                    className="ml-2 text-blue-500"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                            onClick={() => eliminarProducto(producto.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            No disponible
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />
                    <div className="flex justify-center mt-4">
    {Array.from({ length: Math.ceil(filteredProductos.length / itemsPerPage) }, (_, i) => (
        <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 mx-1 ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'
            } rounded`}
        >
            {i + 1}
        </button>
    ))}
</div>

                </div>
            </div>
            <br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
