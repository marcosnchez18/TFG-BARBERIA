import React from 'react';
import '../../css/Barber.css'; // Asegúrate de importar el archivo CSS

export default function Finpaginas() {
    return (
        <section className="fin_home2">
            <div className="fin-content">
                <img className="logo_fin" src="/images/logo.png" alt="Logo de Barbería" />
                <p className="dir">Calle Ancha, 43, Sanlúcar de Bda (11540), Cádiz</p>
                <p className="dir">+34 622541527 +34 956 56 78 32</p>
                <p className="dir">barbers18sanlucar@gmail.com</p>
                <br /><br /><br />
                <hr />
                <br /><br /><br />

                {/* Añadimos los íconos de redes sociales */}
                <div className="social-icons flex justify-center space-x-4">
                    <a href="https://www.instagram.com/marcosnchez18" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-8 h-8" />
                    </a>
                    <a href="https://www.facebook.com/marcosnchez18" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-8 h-8" />
                    </a>

                </div>
            </div>
            <br /><br /><br /><br />
        </section>
    );
}
