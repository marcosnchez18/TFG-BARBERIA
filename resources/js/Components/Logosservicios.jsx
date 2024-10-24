import React from 'react';
import '../../css/Barber.css'; // Asegúrate de importar el archivo CSS

export default function LogosServicios() {
    return (
        <div className="logos-container">
            {/* Primer servicio */}
            <div className="logo-wrapper">
                <img className="logo_servicios animated-logo" src="/images/tijeras.png" alt="Logo Cortar" />
                <p className="logo-text2">Cortar</p>
                <p className="logo-text">
                    Nuestros <br /> profesionales le <br /> ayudarán a elegir el <br /> corte más adecuado a
                    <br /> su rostro, usted podrá <br /> optar por un corte <br /> clásico atemporal de <br /> la vieja
                    escuela o <br /> renovarse al completo.
                </p>
            </div>

            {/* Segundo servicio */}
            <div className="logo-wrapper">
                <img className="logo_servicios animated-logo" src="/images/brocha.png" alt="Logo Color" />
                <p className="logo-text2">Color</p>
                <p className="logo-text">
                    ¿Quieres darle color y <br /> alegría a tu cabello? <br /> Contamos con las <br /> mejores marcas
                    del <br /> mercado para dar color <br /> al cabello de nuestros <br /> clientes, precios <br />
                    económicos y resultados <br /> fantásticos.
                </p>
            </div>

            {/* Tercer servicio */}
            <div className="logo-wrapper">
                <img className="logo_servicios animated-logo" src="/images/maquinilla.png" alt="Logo Keratina" />
                <p className="logo-text2">Keratina</p>
                <p className="logo-text">
                    La keratina es un <br /> auténtico elixir <br /> para el cabello, <br /> hidrata el cuero <br />
                    cabelludo, nutre las <br /> raíces y reestructura <br /> los cabellos finos y <br /> quebrados.
                </p>
            </div>

            {/* Cuarto servicio */}
            <div className="logo-wrapper">
                <img className="logo_servicios animated-logo" src="/images/barba.png" alt="Logo Barba" />
                <p className="logo-text2">Barba</p>
                <p className="logo-text">
                    Somos conocedores <br /> de las mejores <br /> técnicas para dejar <br /> tu barba como de <br />
                    película, contamos <br /> con las mejores <br /> hojas fabricadas en <br /> la pura Italia.
                </p>
            </div>
        </div>
    );
}
