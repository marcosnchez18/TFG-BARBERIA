import React, { useState } from 'react';
import { useForm } from '@inertiajs/react'; // Importar useForm
import { router } from '@inertiajs/react'; // Importar router
import { Link } from '@inertiajs/react';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '../Components/Sobrenosotros';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';

export default function NuevoProveedor({ storeUrl }) {
    const { data, setData, errors } = useForm({
        nombre: '',
        contacto: '',
        telefono: '',
        email: '',
        direccion: '',
        cif: '',
        nif: '',
    });

    const [clientErrors, setClientErrors] = useState({});

    const validateClient = () => {
        const newErrors = {};

        const validateNIF = (nif) => {
            if (!/^\d{8}[A-Z]$/.test(nif)) return false;

            const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
            const numero = parseInt(nif.slice(0, -1), 10);
            const letraCalculada = letras[numero % 23];
            return letraCalculada === nif.slice(-1);
        };

        const validateCIF = (cif) => {
            if (!/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[A-J0-9]$/.test(cif)) return false;

            const letras = 'JABCDEFGHI';
            const letra = cif.charAt(0);
            const numeros = cif.slice(1, -1);
            const control = cif.slice(-1);

            let sumaPar = 0;
            let sumaImpar = 0;

            for (let i = 0; i < numeros.length; i++) {
                const digito = parseInt(numeros[i], 10);
                if (i % 2 === 0) { // Posiciones impares (pares en índice)
                    const doble = digito * 2;
                    sumaImpar += Math.floor(doble / 10) + (doble % 10);
                } else {
                    sumaPar += digito;
                }
            }

            const sumaTotal = sumaPar + sumaImpar;
            const digitoControl = (10 - (sumaTotal % 10)) % 10;

            if (/[A-J]/.test(control)) {
                return letras[digitoControl] === control;
            } else {
                return String(digitoControl) === control;
            }
        };

        // Validar NIF y CIF
        if (!data.cif && !data.nif) {
            newErrors.cifNif = 'Debes proporcionar al menos un CIF o un NIF.';
        } else {
            if (data.cif && !validateCIF(data.cif)) {
                newErrors.cif = 'El CIF introducido no es válido.';
            }
            if (data.nif && !validateNIF(data.nif)) {
                newErrors.nif = 'El NIF introducido no es válido.';
            }
        }

        // Validaciones existentes
        if (!data.nombre) {
            newErrors.nombre = 'El nombre del proveedor es obligatorio.';
        }

        if (!data.contacto) {
            newErrors.contacto = 'El nombre de contacto es obligatorio.';
        }

        if (!data.telefono) {
            newErrors.telefono = 'El teléfono es obligatorio.';
        } else if (!/^\d{9}$/.test(data.telefono)) {
            newErrors.telefono = 'El teléfono debe tener 9 dígitos.';
        }


        if (!data.email) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Introduce un correo electrónico válido.';
        }

        if (!data.direccion) {
            newErrors.direccion = 'La dirección es obligatoria.';
        }

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const submit = async (e) => {
        e.preventDefault();

        // Realiza la validación en el cliente
        if (!validateClient()) {
            // Combina todos los errores en un solo mensaje
            const errorMessages = Object.values(clientErrors)
                .flat()
                .join('<br>');

            // Muestra los errores con SweetAlert
            Swal.fire({
                title: 'Errores de validación',
                html: errorMessages,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });

            return; // Detiene el envío del formulario
        }

        try {
            const response = await fetch(route('proveedores.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 422) {
                    const serverErrors = Object.values(errorData.errors)
                        .flat()
                        .join('<br>');
                    Swal.fire({
                        title: 'Errores del servidor',
                        html: serverErrors,
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                    });
                } else {
                    throw new Error(errorData.message || 'Error al registrar el proveedor.');
                }
                return;
            }

            const result = await response.json();

            Swal.fire({
                title: 'Proveedor registrado',
                text: result.message,
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                router.visit('/opciones');
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };



    return (
        <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/images/barberia.jpg')" }}>
            <NavigationAdmin />

            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-20 relative">
                <div className="absolute top-2 right-2">
                    <Link href="/opciones" className="text-black-600 text-xl font-bold hover:text-gray-400">✕</Link>
                </div>

                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Alta Proveedor
                </h2>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-600">Nombre</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                        />
                        {clientErrors.nombre && <div className="text-red-600 text-sm mt-1">{clientErrors.nombre}</div>}
                        {errors.nombre && <div className="text-red-600 text-sm mt-1">{errors.nombre}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">Nombre de Contacto</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.contacto}
                            onChange={(e) => setData('contacto', e.target.value)}
                        />
                        {clientErrors.contacto && <div className="text-red-600 text-sm mt-1">{clientErrors.contacto}</div>}
                        {errors.contacto && <div className="text-red-600 text-sm mt-1">{errors.contacto}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">Teléfono</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.telefono}
                            onChange={(e) => setData('telefono', e.target.value)}
                        />
                        {clientErrors.telefono && <div className="text-red-600 text-sm mt-1">{clientErrors.telefono}</div>}
                        {errors.telefono && <div className="text-red-600 text-sm mt-1">{errors.telefono}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">Correo electrónico</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {clientErrors.email && <div className="text-red-600 text-sm mt-1">{clientErrors.email}</div>}
                        {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">Dirección</label>
                        <textarea
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.direccion}
                            onChange={(e) => setData('direccion', e.target.value)}
                        />
                        {clientErrors.direccion && <div className="text-red-600 text-sm mt-1">{clientErrors.direccion}</div>}
                        {errors.direccion && <div className="text-red-600 text-sm mt-1">{errors.direccion}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">CIF</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.cif}
                            onChange={(e) => setData('cif', e.target.value)}
                        />
                        {clientErrors.cifNif && <div className="text-red-600 text-sm mt-1">{clientErrors.cifNif}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">NIF</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.nif}
                            onChange={(e) => setData('nif', e.target.value)}
                        />
                        {clientErrors.cifNif && <div className="text-red-600 text-sm mt-1">{clientErrors.cifNif}</div>}
                    </div>

                    <button
                        type="submit"
                        className="w-full font-bold py-2 px-4 rounded-md hover:opacity-90 transition duration-300"
                        style={{ backgroundColor: '#CFA15D', color: '#171717' }}
                    >
                        Registrar Proveedor
                    </button>
                </form>
            </div>
            <br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
