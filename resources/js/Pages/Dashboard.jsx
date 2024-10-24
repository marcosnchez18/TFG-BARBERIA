import React from 'react';
import { usePage } from '@inertiajs/react'; // Importa usePage para acceder a los props globales
import NavigationCliente from '../Components/NavigationCliente';
import '../../css/Barber.css';

export default function Dashboard() {
    // Acceder a los datos del usuario actual desde Inertia
    const { user } = usePage().props;

    return (
        <div>
            <NavigationCliente />
            <div className="container mx-auto p-8">
                {/* Muestra el nombre del usuario autenticado */}
                <h1 className="text-4xl font-bold">Bienvenido al Dashboard del Cliente, {user.nombre}</h1>
                {/* Aquí va el contenido del cliente */}
            </div>
        </div>
    );
}
