import React, { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';
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

    const validateFields = (field) => {
        let error = null;
        if (field === 'nombre') {
            if (!data.nombre.trim()) {
                error = 'El nombre no puede estar vacío.';
            } else if (data.nombre === cliente.nombre) {
                error = 'Por favor, introduce un nombre distinto al actual.';
            }
        }
        if (field === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email.trim()) {
                error = 'El email no puede estar vacío.';
            } else if (!emailPattern.test(data.email)) {
                error = 'Por favor, introduce un email válido.';
            } else if (data.email === cliente.email) {
                error = 'Por favor, introduce un email distinto al actual.';
            }
        }
        return error;
    };

    const handleSubmit = (field) => {
        const errorMessage = validateFields(field);
        if (errorMessage) {
            Swal.fire('Error', errorMessage, 'error');
            return;
        }
        patch(route('cliente.update'), {
            preserveScroll: true,
            onSuccess: () => {
                if (field === 'email') {
                    Swal.fire({
                        title: 'Revisa tu correo',
                        text: 'Se ha enviado un enlace de verificación a tu nuevo email.',
                        icon: 'info',
                    });
                } else {
                    Swal.fire('Actualizado', `${field} actualizado correctamente`, 'success');
                }
                setIsEditing({ ...isEditing, [field]: false });
            },
            onError: () => {
                Swal.fire('Error', `No se pudo actualizar el campo ${field}`, 'error');
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
                <br /><br /><br /><br /><br /><br /><br />
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
            type="text" // Cambiado de "number" a "text" para compatibilidad con el símbolo
            value={`${cliente.saldo || 'N/A'} €`}
            disabled
            className="mis-datos-cliente-input mis-datos-cliente-disabled mis-datos-cliente-currency"
        />
    </div>
</div>


                        <div className="mis-datos-cliente-field-container">
                            <label className="mis-datos-cliente-label">Número de Tarjeta VIP:</label>
                            <input
                                type="text"
                                value={cliente.numero_tarjeta_vip || 'N/A'}
                                disabled
                                className="mis-datos-cliente-input mis-datos-cliente-disabled"
                            />
                        </div>

                        {cliente.referido_por && (
                            <div className="mis-datos-cliente-field-container">
                                <label className="mis-datos-cliente-label">Referido por:</label>
                                <input
                                    type="text"
                                    value={cliente.referido_por}
                                    disabled
                                    className="mis-datos-cliente-input mis-datos-cliente-disabled"
                                />
                            </div>
                        )}
                    </form>
                </div>
            </div>
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
