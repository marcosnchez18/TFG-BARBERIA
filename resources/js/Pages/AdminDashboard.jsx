import React from 'react';
import NavigationAdmin from '../Components/NavigationAdmin'; // Asegúrate de que la ruta sea correcta

export default function AdminDashboard() {
    return (
        <div>
            {/* Navegación del Admin */}
            <NavigationAdmin admin={true} />

            <div className="container mx-auto mt-12">
                <h1 className="text-4xl font-bold">Panel de Control del Admin</h1>
                {/* Aquí va el contenido del panel del admin */}
            </div>
        </div>
    );
}
