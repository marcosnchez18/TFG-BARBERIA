import { Link } from '@inertiajs/react'; // Importa el Link de Inertia

export default function FinHome() {
    return (
        <section className="fin_home">
            <h2 className="text-3xl font-bold mb-4 text-white">Nuestros Clientes</h2>
            <br/><br/><br/>
            <div className="imagenes-contenedor">
                <div className="fila">
                    <img className="fotos_fades" src="/images/fade1.png" alt="Imagen 1" />
                    <img className="fotos_fades" src="/images/fade2.png" alt="Imagen 2" />
                </div>
                <div className="fila">
                    <img className="fotos_fades" src="/images/fade3.jpg" alt="Imagen 3" />
                    <img className="fotos_fades" src="/images/fade4.png" alt="Imagen 4" />
                </div>
                <div className="fila-centro">
                    <img className="fotos_fades grande" src="/images/fade5.png" alt="Imagen 5" />
                </div>
            </div>

            <div>
                <p className="precios">Ven a visitarnos</p>
                <p className="reser">Reserva una cita</p>
                <p className="reser_desc">
                    Reserva una cita ahora con <br /> nosotros y disfruta un <br /> servicio a la altura de
                    <br /> nuestros clientes
                </p>
                <br/><br/><br/>

                {/* Cambiamos el botón a Link para que redirija al registro */}
                <Link href="/register" className="boton_lugar">
                    Regístrate
                </Link>
            </div>
        </section>
    );
}
