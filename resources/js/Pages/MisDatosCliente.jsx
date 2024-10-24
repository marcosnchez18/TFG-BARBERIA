import React from 'react';
import NavigationCliente from '../Components/NavigationCliente';

export default function MisDatosCliente() {
    return (
        <div>
            <NavigationCliente />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold">Bienvenido a la página de mis datos de Clientes</h1>
            </div>
        </div>
    );
}
