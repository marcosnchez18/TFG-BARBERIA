import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import NavigationAdmin from '../Components/NavigationAdmin';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEuroSign, faBoxes, faStoreAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import SobreNosotros from '../Components/Sobrenosotros';
import { Link } from '@inertiajs/react';

export default function AltaProducto() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [proveedores, setProveedores] = useState([]);
    const [selectedProveedor, setSelectedProveedor] = useState('');
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        // Cargar los proveedores desde la API
        axios.get('/api/proveedores')
            .then(response => setProveedores(response.data))
            .catch(error => console.error('Error al cargar proveedores:', error));
    }, []);

    const validateForm = () => {
        // Validar los campos
        if (!nombre || !descripcion || !precio || !stock || !selectedProveedor) {
            Swal.fire('Campos incompletos', 'Por favor, complete todos los campos y seleccione un proveedor.', 'warning');
            return false;
        }

        // Validación de precio
        if (isNaN(precio) || parseFloat(precio) <= 0) {
            Swal.fire('Precio inválido', 'Por favor, ingrese un precio válido.', 'warning');
            return false;
        }

        // Validación de stock (debe ser un número entero)
        if (!Number.isInteger(Number(stock)) || Number(stock) <= 0) {
            Swal.fire('Stock inválido', 'Por favor, ingrese un stock válido (debe ser un número entero).', 'warning');
            return false;
        }

        return true;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Mostrar Swal mientras se procesa
        Swal.fire({
            title: 'Añadiendo Producto',
            text: 'El producto se está añadiendo.',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('precio', precio);
        formData.append('stock', stock);
        formData.append('proveedor_id', selectedProveedor);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        // Enviar los datos con Inertia
        Inertia.post('/admin/productos', formData, {
            forceFormData: true,
            onSuccess: (response) => {
                // Cerrar el Swal de carga
                Swal.close();

                // Mostrar alerta de éxito con el mensaje desde el backend
                Swal.fire({
                    title: 'Producto añadido',
                    text: response.props.message || 'El nuevo producto ha sido creado exitosamente.',
                    icon: 'success',
                    showConfirmButton: true,
                });

                // Limpiar los campos del formulario
                setNombre('');
                setDescripcion('');
                setPrecio('');
                setStock('');
                setSelectedProveedor('');
                setImagen(null);
            },
            onError: (errors) => {
                // Cerrar el Swal de carga
                Swal.close();

                // Mostrar alerta de error con mensaje general o uno específico de los errores
                Swal.fire({
                    title: 'Error',
                    text: errors.message || 'Hubo un problema al añadir el producto.',
                    icon: 'error',
                    showConfirmButton: true,
                });
            }
        });
    };



    return (
        <div className="admin-dashboard min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundAttachment: 'fixed',
            }}>
            <NavigationAdmin admin={true} />
            <div className="container mx-auto p-8">
                <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-20 relative">
                    <div className="absolute top-2 right-2">
                        <Link href="/opciones" className="text-black-600 text-xl font-bold hover:text-gray-400">✕</Link>
                    </div>
                    <h1 className="text-4xl font-extrabold text-center text-[#000000] mb-6">Añadir Nuevo Producto</h1>
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Nombre del Producto:</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faBoxes} className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                                    placeholder="Ej. Gomina"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Descripción:</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faPen} className="absolute left-3 top-3 text-gray-500" />
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    className="w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                                    placeholder="Describa el producto..."
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Precio (€):</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faEuroSign} className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    className="w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                                    placeholder="Ej. 25.99"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Stock:</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faBoxes} className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="number"
                                    step="1"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                                    placeholder="Ej. 100"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Seleccionar Proveedor:</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faStoreAlt} className="absolute left-3 top-3 text-gray-500" />
                                <select
                                    value={selectedProveedor}
                                    onChange={(e) => setSelectedProveedor(e.target.value)}
                                    className="w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43] bg-white"
                                    required
                                >
                                    <option value="">Seleccione un proveedor</option>
                                    {proveedores.map(proveedor => (
                                        <option key={proveedor.id} value={proveedor.id}>
                                            {proveedor.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Imagen (opcional):</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={(e) => setImagen(e.target.files[0])}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="px-6 py-3 text-white bg-[#A87B43] font-semibold rounded-lg hover:bg-[#875d34] transition-all duration-200"
                            >
                                Añadir Producto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
