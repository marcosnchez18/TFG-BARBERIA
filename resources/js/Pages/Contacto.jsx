import React from 'react';
import Footer from '../Components/Footer';
import Localizacion from '../Components/Localizacion';
import SobreNosotros from '../Components/Sobrenosotros';
import '../../css/Barber.css';
import Naviser from '@/Components/NavigationSer';
import WhatsAppButton from '@/Components/Wasa'

export default function Contacto() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navegación */}
            <Naviser />

            {/* Sección de contacto */}
            <section className="py-12 bg-white text-center">
                <div className="container mx-auto">
                    <h2 className="contact-title">Contáctanos</h2>
                    <p className="contact-description">
                        Estamos aquí para ayudarte con cualquier consulta o reserva. ¡No dudes en ponerte en contacto con nosotros!
                    </p>

                    {/* Información de contacto */}
                    <div className="contact-grid">
                        {/* Dirección */}
                        <div className="contact-box">
                            <h2 className="contact-subtitle">Nuestra Ubicación</h2>
                            <p className="contact-text">Calle Ancha, 43</p>
                            <p className="contact-text">Sanlúcar de Barrameda (11540), Cádiz</p>
                        </div>

                        {/* Teléfonos */}
                        <div className="contact-box">
                            <h2 className="contact-subtitle">Teléfonos de Contacto</h2>
                            <p className="contact-text">+34 622 541 527</p>
                            <p className="contact-text">+34 956 56 78 32</p>
                        </div>

                        {/* Correos electrónicos */}
                        <div className="contact-box">
                            <h2 className="contact-subtitle">Correos Electrónicos</h2>
                            <p className="contact-text">info@barber18@barbershop.com</p>
                            <p className="contact-text">barbersanlucar@gmail.com</p>
                        </div>

                        {/* Horarios */}
                        <div className="contact-box">
                            <h2 className="contact-subtitle">Horario de Atención</h2>
                            <p className="contact-text">Lunes a Viernes: 10:00 - 14:00  y de  16:00 - 20:00</p>
                            <p className="contact-text">Sábados: 10:00 - 14:00 </p>
                            <p className="contact-text">Domingos: Cerrado</p>
                        </div>
                    </div>
                </div>
            </section>

            <Localizacion />
            <SobreNosotros />

            {/* Footer */}
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
