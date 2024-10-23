import React from 'react';
import NavigationCliente from '../Components/NavigationCliente';
import '../../css/Barber.css';

export default function Dashboard() {
    return (
        <div>
            <NavigationCliente />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold">Bienvenido al Dashboard del Cliente suu titoo</h1>
                {/* Contenido del cliente */}
            </div>
        </div>
    );
}
