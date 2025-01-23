import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import NavigationAdmin from '../../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import { Link } from '@inertiajs/react';

export default function EditarProveedores({ proveedores }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [editableId, setEditableId] = useState(null);
    const [editableField, setEditableField] = useState(null);
    const [editableValue, setEditableValue] = useState('');

    const eliminarProveedor = (id) => {
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
                Inertia.delete(route('proveedores.destroy', id), {
                    onSuccess: (page) => {
                        // Obtenemos el mensaje de `page.props.flash.message`
                        const message = page.props?.flash?.message;

                        // Si no hay mensaje, terminamos
                        if (!message) return;

                        // Si el mensaje contiene "ERROR:", mostramos alerta de error
                        if (message.includes('ERROR:')) {
                            Swal.fire('Error', message, 'error');
                        } else {
                            // Caso contrario, asumimos que es éxito
                            Swal.fire('Eliminado', message, 'success');
                        }
                    },
                });
            }
        });
    };





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






    const saveFieldChange = (id) => {
        // Validar campos según el tipo
        if (editableField === 'nif') {
            if (!editableValue) {
                Swal.fire('Error', 'El NIF no puede estar vacío.', 'error');
                return;
            }
            if (!validateNIF(editableValue)) {
                Swal.fire('Error', 'El NIF introducido no es válido.', 'error');
                return;
            }
        }

        if (editableField === 'cif') {
            if (!editableValue) {
                Swal.fire('Error', 'El CIF no puede estar vacío.', 'error');
                return;
            }
            if (!validateCIF(editableValue)) {
                Swal.fire('Error', 'El CIF introducido no es válido.', 'error');
                return;
            }
        }

        if (editableField === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!editableValue) {
                Swal.fire('Error', 'El correo electrónico no puede estar vacío.', 'error');
                return;
            }
            if (!emailRegex.test(editableValue)) {
                Swal.fire('Error', 'El correo electrónico introducido no es válido.', 'error');
                return;
            }
        }

        if (editableField === 'telefono') {
            const telefonoRegex = /^[0-9]{9}$/;
            if (!editableValue) {
                Swal.fire('Error', 'El teléfono no puede estar vacío.', 'error');
                return;
            }
            if (!telefonoRegex.test(editableValue)) {
                Swal.fire('Error', 'El teléfono introducido no es válido. Debe contener 9 dígitos.', 'error');
                return;
            }
        }

        if (editableField === 'nombre' || editableField === 'contacto' || editableField === 'direccion') {
            if (!editableValue) {
                Swal.fire('Error', `El campo ${editableField} no puede estar vacío.`, 'error');
                return;
            }
        }

        // Enviar la solicitud para guardar los cambios
        const data = { [editableField]: editableValue };

        Inertia.patch(route('proveedores.updateField', id), data, {
            onSuccess: () => {
                Swal.fire('Actualizado', `${editableField} actualizado con éxito.`, 'success');
                setEditableId(null);
                setEditableField(null);
                setEditableValue('');
            },
            onError: (errors) => {
                Swal.fire('Error', 'No se pudo actualizar el campo. Por favor, revisa los datos e intenta nuevamente.', 'error');
            },
        });
    };



    const filteredProveedores = proveedores.filter((proveedor) =>
        proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proveedor.nif && proveedor.nif.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (proveedor.cif && proveedor.cif.toLowerCase().includes(searchTerm.toLowerCase()))
    );


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

            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-8xl mx-auto mt-20 relative">
                <div className="absolute top-2 right-2">
                    <Link href="/opciones" className="text-black-600 text-xl font-bold hover:text-gray-400">✕</Link>
                </div>
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6">Gestión de Proveedores</h2>
                <br />
                <p className=" text-center font-bold text-red-800 mb-6">Recuerda que no puedes eliminar un proveedor con productos.</p>


                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, contacto o correo electrónico..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
                        <thead>
                            <tr className="bg-[#464242] text-white">
                                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                                <th className="border border-gray-300 px-4 py-2">Contacto</th>
                                <th className="border border-gray-300 px-4 py-2">NIF</th>
                                <th className="border border-gray-300 px-4 py-2">CIF</th>
                                <th className="border border-gray-300 px-4 py-2">Correo</th>
                                <th className="border border-gray-300 px-4 py-2">Teléfono</th>
                                <th className="border border-gray-300 px-4 py-2">Dirección</th>
                                <th className="border border-gray-300 px-4 py-2">Acción</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredProveedores.map((proveedor) => (
                                <tr key={proveedor.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === proveedor.id && editableField === 'nombre' ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => saveFieldChange(proveedor.id)}
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
                                                {proveedor.nombre}
                                                <button
                                                    onClick={() => {
                                                        setEditableId(proveedor.id);
                                                        setEditableField('nombre');
                                                        setEditableValue(proveedor.nombre);
                                                    }}
                                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === proveedor.id && editableField === 'contacto' ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => saveFieldChange(proveedor.id)}
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
                                                {proveedor.contacto}
                                                <button
                                                    onClick={() => {
                                                        setEditableId(proveedor.id);
                                                        setEditableField('contacto');
                                                        setEditableValue(proveedor.contacto);
                                                    }}
                                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="border border-gray-300 px-4 py-2">
    {editableId === proveedor.id && editableField === 'nif' ? (
        <div className="flex items-center">
            <input
                type="text"
                value={editableValue}
                onChange={(e) => setEditableValue(e.target.value)}
                className="border rounded p-1"
            />
            <button
                onClick={() => saveFieldChange(proveedor.id)}
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
            {proveedor.nif}
            <button
                onClick={() => {
                    setEditableId(proveedor.id);
                    setEditableField('nif');
                    setEditableValue(proveedor.nif || '');
                }}
                className="ml-2 text-blue-500 hover:text-blue-700"
            >
                ✏️
            </button>
        </div>
    )}
</td>

<td className="border border-gray-300 px-4 py-2">
    {editableId === proveedor.id && editableField === 'cif' ? (
        <div className="flex items-center">
            <input
                type="text"
                value={editableValue}
                onChange={(e) => setEditableValue(e.target.value)}
                className="border rounded p-1"
            />
            <button
                onClick={() => saveFieldChange(proveedor.id)}
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
            {proveedor.cif}
            <button
                onClick={() => {
                    setEditableId(proveedor.id);
                    setEditableField('cif');
                    setEditableValue(proveedor.cif || '');
                }}
                className="ml-2 text-blue-500 hover:text-blue-700"
            >
                ✏️
            </button>
        </div>
    )}
</td>


<td className="border border-gray-300 px-4 py-2">
    {editableId === proveedor.id && editableField === 'email' ? (
        <div className="flex items-center">
            <input
                type="text"
                value={editableValue}
                onChange={(e) => setEditableValue(e.target.value)}
                className="border rounded p-1"
            />
            <button
                onClick={() => saveFieldChange(proveedor.id)}
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
            {proveedor.email}
            <button
                onClick={() => {
                    setEditableId(proveedor.id);
                    setEditableField('email');
                    setEditableValue(proveedor.email || '');
                }}
                className="ml-2 text-blue-500 hover:text-blue-700"
            >
                ✏️
            </button>
        </div>
    )}
</td>






                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === proveedor.id && editableField === 'telefono' ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => saveFieldChange(proveedor.id)}
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
                                                {proveedor.telefono}
                                                <button
                                                    onClick={() => {
                                                        setEditableId(proveedor.id);
                                                        setEditableField('telefono');
                                                        setEditableValue(proveedor.telefono);
                                                    }}
                                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>


                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === proveedor.id && editableField === 'direccion' ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => saveFieldChange(proveedor.id)}
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
                                                {proveedor.direccion}
                                                <button
                                                    onClick={() => {
                                                        setEditableId(proveedor.id);
                                                        setEditableField('direccion');
                                                        setEditableValue(proveedor.direccion);
                                                    }}
                                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                                        <button
                                            onClick={() => eliminarProveedor(proveedor.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 inline-flex items-center"
                                        >
                                            🗑️ <span className="ml-1"></span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
