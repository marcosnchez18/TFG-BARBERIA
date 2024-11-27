import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import NavigationCliente from '../Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import '../../css/Barber.css';
import Footer from '../Components/Footer';

export default function MiFicha({ ficha, user }) {
    const [colores, setColores] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { data, setData, put, errors } = useForm({
        color: ficha?.color || '',
        tinte: ficha?.tinte || false,
        colores_usados: ficha?.colores_usados || [],
        tipo_pelo: ficha?.tipo_pelo || '',
        tipo_rostro: ficha?.tipo_rostro || '',
        tipo_corte: ficha?.tipo_corte || '',
        barba: ficha?.barba || false,
        tipo_barba: ficha?.tipo_barba || '',
        textura: ficha?.textura || '',
        canas: ficha?.canas || '',
        injerto_capilar: ficha?.injerto_capilar || false,
        estado: ficha?.estado || '',
        deseos: ficha?.deseos || '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);


    useEffect(() => {
        fetch('/data/colores.json')
            .then((response) => response.json())
            .then((data) => setColores(data))
            .catch((error) => console.error('Error al cargar colores:', error));
    }, []);

    const validateForm = () => {
        if (!data.color) {
            Swal.fire('Error', 'Debe seleccionar un color.', 'error');
            return false;
        }
        if (data.tinte && data.colores_usados.length === 0) {
            Swal.fire('Error', 'Debe seleccionar al menos un color de tinte.', 'error');
            return false;
        }
        if (!data.tipo_pelo) {
            Swal.fire('Error', 'Debe seleccionar el tipo de pelo.', 'error');
            return false;
        }
        if (!data.tipo_rostro) {
            Swal.fire('Error', 'Debe seleccionar el tipo de rostro.', 'error');
            return false;
        }
        if (!data.tipo_corte) {
            Swal.fire('Error', 'Debe seleccionar el tipo de corte.', 'error');
            return false;
        }
        if (data.barba && !data.tipo_barba) {
            Swal.fire('Error', 'Debe seleccionar el tipo de barba.', 'error');
            return false;
        }
        if (!data.textura) {
            Swal.fire('Error', 'Debe seleccionar la textura del pelo.', 'error');
            return false;
        }
        if (!data.canas) {
            Swal.fire('Error', 'Debe seleccionar la cantidad de canas.', 'error');
            return false;
        }
        if (!data.estado) {
            Swal.fire('Error', 'Debe seleccionar el estado del cuero cabelludo.', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        put(route('clientes.ficha.update', user.id), {
            onSuccess: () => {
                Swal.fire({
                    title: '¡Ficha actualizada correctamente!',
                    text: '¿Quieres subir tu imagen para conocerte mejor?',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Sí',
                    cancelButtonText: 'No',
                }).then((result) => {
                    if (result.isConfirmed) {
                        setIsModalOpen(true); // Abrir el modal si elige "Sí"
                    }
                });
            },
            onError: (error) => {
                Swal.fire('Error', 'Hubo un problema al guardar la ficha. Intente nuevamente.', 'error');
                console.error(error);
            },
        });
    };


    const handleImageUpload = () => {
        if (!selectedImage) {
            Swal.fire('Error', 'Selecciona una imagen antes de subirla.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('imagen', selectedImage);

        axios.post(route('clientes.ficha.uploadImage', user.id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(() => {
            Swal.fire('¡Éxito!', 'Tu imagen se ha subido correctamente.', 'success').then(() => {
                window.location.reload(); // Recarga la página
            });
        })
        .catch(() => {
            Swal.fire('Error', 'Hubo un problema al subir la imagen. Intenta nuevamente.', 'error');
        });
    };




    return (
        <div
            style={{
                backgroundImage: "url('/images/barberia.jpg')",
                fontFamily: "New Times Roman",


            }}
        >
            <NavigationCliente />
            <div className="flex justify-center items-center py-10 px-6">
                <div className="max-w-5xl w-full bg-white bg-opacity-90 rounded-lg p-6 shadow-xl"> {/* Marco translúcido */}
                    <h2 className="mis-datos-cliente-title">Mi Ficha</h2>
                    <div className="flex justify-center mb-6">
    {ficha?.imagen ? (
        <img
            src={`/storage/${ficha.imagen}`}
            alt="Imagen del cliente"
            className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
        />
    ) : (
        <div className="w-32 h-32 rounded-full border-4 border-gray-300 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Sin imagen</span>
        </div>
    )}
</div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Color */}
                        <div>
                            <label className="mis-datos-cliente-label">Color:</label>
                            <select
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Seleccionar</option>
                                <option value="rubio">Rubio</option>
                                <option value="castaño">Castaño</option>
                                <option value="negro">Negro</option>
                                <option value="pelirrojo">Pelirrojo</option>
                            </select>
                            {errors.color && <p className="text-red-500 text-sm">{errors.color}</p>}
                        </div>
                        <div>

                            {/* Tinte */}
                            <div>
                                <label className="mis-datos-cliente-label">¿Usa tinte?</label>
                                <div className="flex items-center space-x-4 mt-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="tinte"
                                            value="true"
                                            checked={data.tinte === true}
                                            onChange={() => setData('tinte', true)}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">Sí</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="tinte"
                                            value="false"
                                            checked={data.tinte === false}
                                            onChange={() => setData('tinte', false)}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">No</span>
                                    </label>
                                </div>
                            </div>

                            {data.tinte && (
                                <div className="mt-2">
                                    <label className="mis-datos-cliente-label">
                                        Colores usados:
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="mt-1 w-full text-left bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        >
                                            {data.colores_usados.length > 0
                                                ? data.colores_usados.join(', ')
                                                : 'Seleccionar colores'}
                                        </button>
                                        {dropdownOpen && (
                                            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                {colores.map((color, index) => (
                                                    <div key={index} className="flex items-center px-4 py-2 hover:bg-gray-100">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.colores_usados.includes(color)}
                                                            onChange={() => {
                                                                const updatedColores = data.colores_usados.includes(color)
                                                                    ? data.colores_usados.filter((item) => item !== color)
                                                                    : [...data.colores_usados, color];
                                                                setData('colores_usados', updatedColores);
                                                            }}
                                                            className="form-checkbox h-4 w-4 text-blue-600"
                                                        />
                                                        <label className="ml-2 text-sm text-gray-700">{color}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.colores_usados && (
                                        <p className="text-red-500 text-sm">{errors.colores_usados}</p>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Tipo de pelo */}
                        <div>
                            <label className="mis-datos-cliente-label">Tipo de pelo:</label>
                            <select
                                value={data.tipo_pelo}
                                onChange={(e) => setData('tipo_pelo', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Seleccionar</option>
                                <option value="liso">Liso</option>
                                <option value="ondulado">Ondulado</option>
                                <option value="rizado">Rizado</option>
                                <option value="muy rizado">Muy rizado</option>
                                <option value="afro">Afro</option>
                            </select>
                            {errors.tipo_pelo && <p className="text-red-500 text-sm">{errors.tipo_pelo}</p>}
                        </div>

                        {/* Tipo de rostro */}
                        <div>
                            <label className="mis-datos-cliente-label">Tipo de rostro:</label>
                            <select
                                value={data.tipo_rostro}
                                onChange={(e) => setData('tipo_rostro', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Seleccionar</option>
                                <option value="ovalado">Ovalado</option>
                                <option value="cuadrado">Cuadrado</option>
                                <option value="cuadrado largo">Cuadrado Largo</option>
                                <option value="redondo">Redondo</option>
                                <option value="triangular ovalado">Triangular Ovalado</option>
                                <option value="triangular">Triangular</option>
                                <option value="triangular invertido">Triangular Invertido</option>
                            </select>
                            {errors.tipo_rostro && <p className="text-red-500 text-sm">{errors.tipo_rostro}</p>}
                        </div>

                        {/* Tipo de Corte */}
                        <div>
                            <label className="mis-datos-cliente-label">Tipo de corte:</label>
                            <select
                                value={data.tipo_corte}
                                onChange={(e) => setData('tipo_corte', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Seleccionar</option>
                                <option value="clásico">Clásico</option>
                                <option value="degradado">Degradado</option>
                                <option value="largo">Largo</option>
                                <option value="rapado">Rapado</option>
                            </select>
                            {errors.tipo_corte && <p className="text-red-500 text-sm">{errors.tipo_corte}</p>}
                        </div>

                        {/* Barba */}
                        <div>
                            <label className="mis-datos-cliente-label">¿Tiene barba?</label>
                            <div className="flex items-center space-x-4 mt-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="barba"
                                        value="true"
                                        checked={data.barba === true}
                                        onChange={() => setData('barba', true)}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Sí</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="barba"
                                        value="false"
                                        checked={data.barba === false}
                                        onChange={() => setData('barba', false)}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">No</span>
                                </label>
                            </div>

                            {data.barba && (
                                <div className="mt-4">
                                    <label className="mis-datos-cliente-label">Tipo de barba:</label>
                                    <select
                                        value={data.tipo_barba}
                                        onChange={(e) => setData('tipo_barba', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="larga">Larga</option>
                                        <option value="tres días">Tres días</option>
                                        <option value="degradada">Degradada</option>
                                        <option value="pico">Pico</option>
                                    </select>
                                    {errors.tipo_barba && <p className="text-red-500 text-sm">{errors.tipo_barba}</p>}
                                </div>
                            )}
                        </div>


                        {/* Textura */}
                        <div>
                            <label className="mis-datos-cliente-label">Textura:</label>
                            <select
                                value={data.textura}
                                onChange={(e) => setData('textura', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Seleccionar</option>
                                <option value="grueso">Grueso</option>
                                <option value="delgado">Delgado</option>
                                <option value="mediano">Mediano</option>
                                <option value="fino">Fino</option>
                            </select>
                            {errors.textura && <p className="text-red-500 text-sm">{errors.textura}</p>}
                        </div>

                        {/* Canas */}
                        <div>
                            <label className="mis-datos-cliente-label">Canas:</label>
                            <select
                                value={data.canas}
                                onChange={(e) => setData('canas', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Seleccionar</option>
                                <option value="nada">Nada</option>
                                <option value="pocas">Pocas</option>
                                <option value="muchas">Muchas</option>
                            </select>
                            {errors.canas && <p className="text-red-500 text-sm">{errors.canas}</p>}
                        </div>

                        {/* Injerto Capilar */}
                        <div>
                            <label className="mis-datos-cliente-label">¿Tiene injerto capilar?</label>
                            <div className="flex items-center space-x-4 mt-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="injerto_capilar"
                                        value="true"
                                        checked={data.injerto_capilar === true}
                                        onChange={() => setData('injerto_capilar', true)}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Sí</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="injerto_capilar"
                                        value="false"
                                        checked={data.injerto_capilar === false}
                                        onChange={() => setData('injerto_capilar', false)}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">No</span>
                                </label>
                            </div>
                        </div>
                        {/* Estado */}
                        <div>
                            <label className="mis-datos-cliente-label">Estado:</label>
                            <select
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Seleccionar</option>
                                <option value="graso">Graso</option>
                                <option value="seco">Seco</option>
                                <option value="medio">Medio</option>
                            </select>
                            {errors.estado && <p className="text-red-500 text-sm">{errors.estado}</p>}
                        </div>
                        {/* Deseos */}
                        <div>
                            <label className="mis-datos-cliente-label">Deseos:</label>
                            <textarea
                                value={data.deseos}
                                onChange={(e) => setData('deseos', e.target.value)}
                                placeholder="Describe tus deseos o preferencias..."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            ></textarea>
                            {errors.deseos && <p className="text-red-500 text-sm">{errors.deseos}</p>}
                        </div>

                        {/* Botón Guardar */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                            Guardar
                        </button>
                    </form>

                </div>

                {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 relative w-96">
            {/* Botón para cerrar el modal */}
            <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
                ✕
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">Sube tu imagen</h2>

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="mb-4 block w-full text-gray-700"
            />
            <button
                onClick={handleImageUpload}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
                Subir Imagen
            </button>
        </div>
    </div>
)}

            </div>
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
