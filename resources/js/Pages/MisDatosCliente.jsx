import React, { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import NavigationCliente from '../Components/NavigationCliente';
import '../../css/Barber.css';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';

export default function MisDatosCliente() {
    const { cliente } = usePage().props;
    const { data, setData, patch, processing, errors } = useForm({
        nombre: cliente.nombre,
        email: cliente.email,
    });

    const [isEditing, setIsEditing] = useState({
        nombre: false,
        email: false,
    });
    const [copied, setCopied] = useState(false);

    const handleEliminarCuenta = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer. Tu cuenta será eliminada permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar cuenta',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.post(route('cliente.eliminar'), {}, {
                    onSuccess: () => {
                        Swal.fire('Cuenta eliminada', 'Tu cuenta ha sido eliminada con éxito.', 'success');
                    }
                });
            }
        });
    };

    const copyToClipboard = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(cliente.numero_tarjeta_vip || 'N/A').then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };
    const handleSubmit = (field) => {
        patch(route('cliente.actualizar'), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire('Actualizado', `${field} actualizado correctamente.`, 'success');
                setIsEditing({ ...isEditing, [field]: false });
            },
            onError: () => {
                Swal.fire('Error', `Hubo un problema al actualizar ${field}.`, 'error');
            },
        });
    };


    return (
        <div>
            <NavigationCliente />
            <div
                style={{
                    backgroundImage: `url('/images/barberia.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <br /><br /><br /><br />
                <div id="mis-datos-cliente-container">
                    <h2 className="mis-datos-cliente-title">Mis Datos</h2>
                    <form>
                        <div className="mis-datos-cliente-field-container">
                            <label className="mis-datos-cliente-label">Nombre:</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={data.nombre}
                                    disabled={!isEditing.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="mis-datos-cliente-input"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        isEditing.nombre ? handleSubmit('nombre') : setIsEditing({ ...isEditing, nombre: true })
                                    }
                                    className={`ml-4 mis-datos-cliente-button ${
                                        isEditing.nombre ? 'mis-datos-cliente-button-save' : 'mis-datos-cliente-button-edit'
                                    }`}
                                >
                                    {isEditing.nombre ? 'Guardar' : 'Editar'}
                                </button>
                            </div>
                            {errors.nombre && <div className="mis-datos-cliente-error">{errors.nombre}</div>}
                        </div>

                        <div className="mis-datos-cliente-field-container">
                            <label className="mis-datos-cliente-label">Email:</label>
                            <div className="flex items-center">
                                <input
                                    type="email"
                                    value={data.email}
                                    disabled={!isEditing.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mis-datos-cliente-input"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        isEditing.email ? handleSubmit('email') : setIsEditing({ ...isEditing, email: true })
                                    }
                                    className={`ml-4 mis-datos-cliente-button ${
                                        isEditing.email ? 'mis-datos-cliente-button-save' : 'mis-datos-cliente-button-edit'
                                    }`}
                                >
                                    {isEditing.email ? 'Guardar' : 'Editar'}
                                </button>
                            </div>
                            {errors.email && <div className="mis-datos-cliente-error">{errors.email}</div>}
                        </div>

                        <div className="mis-datos-cliente-field-container">
                            <label className="mis-datos-cliente-label">Saldo:</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={`${cliente.saldo || 'N/A'} €`}
                                    disabled
                                    className="mis-datos-cliente-input mis-datos-cliente-disabled mis-datos-cliente-currency"
                                />
                            </div>
                        </div>

                        <div className="mis-datos-cliente-field-container">
                            <label className="mis-datos-cliente-label">Número de Tarjeta VIP:</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={cliente.numero_tarjeta_vip || 'N/A'}
                                    disabled
                                    className="mis-datos-cliente-input mis-datos-cliente-disabled"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                                    title="Copiar al portapapeles"
                                >
                                    {copied ? (
                                        <span className="text-green-500">✔ ¡Copiado!</span>
                                    ) : (
                                        <i className="fas fa-copy"></i>
                                    )}
                                </button>
                            </div>
                        </div>

                        {cliente.referido_por && (
                            <div className="mis-datos-cliente-field-container">
                                <label className="mis-datos-cliente-label">Invitado por:</label>
                                <input
                                    type="text"
                                    value={cliente.referido_por}
                                    disabled
                                    className="mis-datos-cliente-input mis-datos-cliente-disabled"
                                />
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleEliminarCuenta}
                            className="mt-8 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Eliminar mi cuenta
                        </button>
                        <button
    type="button"
    onClick={() => {
        Inertia.visit(route('password.request'));
    }}
    className="mt-8 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
    Restablecer Contraseña
</button>

                    </form>
                </div>
            </div>
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
