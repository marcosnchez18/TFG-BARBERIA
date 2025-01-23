import React from 'react';
import NavigationAdmin from '../../Components/NavigationAdmin';
import Footer from '../../Components/Footer';
import SobreNosotros from '../../Components/Sobrenosotros';
import ProveedoresPedidos from '../../Components/ProveedoresPedidos';

export default function PedidosProveedores() {
    return (
        <div
            className="admin-dashboard min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url('/images/barberia.jpg')`, backgroundAttachment: 'fixed' }}
        >
            <NavigationAdmin />
            <div className="container mx-auto p-8">
                <ProveedoresPedidos />
            </div>
            <SobreNosotros />
            <Footer />
        </div>
    );
}
