import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';

import Swal from 'sweetalert2';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import axios from 'axios';
import { FaCashRegister, FaCreditCard, FaPaypal, FaChartPie, FaStore, FaTruck, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaDownload } from "react-icons/fa";


export default function ControlCaja() {
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [año, setAño] = useState(new Date().getFullYear());

    const [totales, setTotales] = useState({
        efectivo: 0,
        tarjeta: 0,
        paypal: 0,
        total: 0,
    });

    const volver = () => {
        Inertia.visit('/mi-gestion-admin');
    };





    const [beneficioPedidos, setBeneficioPedidos] = useState({
        ingresos_brutos: 0,
        costos: 0,
        ganancia_neta: 0
    });

    const descargarPDF = () => {
        Swal.fire({
            title: 'Seleccione el mes para descargar',
            input: 'select',
            inputOptions: meses.reduce((acc, curr, i) => {
                acc[i + 1] = curr;
                return acc;
            }, {}),
            inputPlaceholder: 'Seleccione un mes',
            showCancelButton: true,
            confirmButtonText: 'Descargar PDF',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const mesSeleccionado = meses[result.value - 1];
                generarPDF(mesSeleccionado);
            }
        });
    };

    const generarPDF = async (mesNombre) => {
        const input = document.getElementById('control-caja');
        const botonDescarga = document.getElementById('boton-descargar-pdf');

        // Ocultar el botón antes de capturar la imagen
        botonDescarga.style.display = 'none';

        // Esperar un breve momento para asegurarse de que el botón está oculto
        await new Promise(resolve => setTimeout(resolve, 200));

        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`Control_Caja_${mesNombre}_${año}.pdf`);

        // Volver a mostrar el botón después de capturar la imagen
        botonDescarga.style.display = 'block';
    };





    const [gastosProveedores, setGastosProveedores] = useState({
        total_gastado: 0,
        total_pedidos: 0
    });

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const obtenerDatos = async () => {
        try {
            const [cajaRes, gastosRes, beneficioPedidosRes] = await Promise.all([
                axios.get(`/api/caja`, { params: { mes, año } }),
                axios.get(`/api/gastos-proveedores`, { params: { mes, año } }),
                axios.get(`/api/beneficio-pedidos`, { params: { mes, año } })
            ]);

            setTotales(cajaRes.data);
            setGastosProveedores(gastosRes.data);
            setBeneficioPedidos(beneficioPedidosRes.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, [mes, año]);

    return (
        <div
            className="control-caja min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
            }}
        >
            <NavigationAdmin />
            <div className="container mx-auto py-16 px-6" id="control-caja">
                <div className="bg-gray-900 bg-opacity-90 p-8 rounded-xl shadow-2xl">

                    <h2 className="text-4xl font-bold text-center text-white mb-6">📊 Control de Caja</h2>
                    <br /><br />

                    {/* Filtros */}
                    <div className="flex justify-center gap-6 mb-8">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <label className="text-lg font-semibold">📆 Mes:</label>
                            <select
                                value={mes}
                                onChange={(e) => setMes(e.target.value)}
                                className="ml-2 p-2 rounded bg-gray-700 text-white focus:outline-none"
                            >
                                {meses.map((nombreMes, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {nombreMes}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <label className="text-lg font-semibold">📅 Año:</label>
                            <input
                                type="number"
                                value={año}
                                onChange={(e) => setAño(e.target.value)}
                                min="2000"
                                max={new Date().getFullYear()}
                                className="ml-2 p-2 rounded bg-gray-700 text-white focus:outline-none"
                            />
                        </div>


                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            id="boton-descargar-pdf"
                            onClick={descargarPDF}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center"
                        >
                            <FaDownload className="mr-2" /> Descargar en PDF
                        </button>
                    </div>

                    <br /><br />

                    {/* Tarjetas de ingresos de citas */}
                    <h2 className="text-4xl font-bold text-center text-white mt-12 mb-6">📅 Citas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaCashRegister className="text-yellow-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Efectivo en Caja</h2>
                            <p className="text-3xl font-semibold">{totales.efectivo} €</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaCreditCard className="text-blue-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Tarjeta en caja</h2>
                            <p className="text-3xl font-semibold">{totales.tarjeta} €</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaPaypal className="text-indigo-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Pagos con PayPal</h2>
                            <p className="text-3xl font-semibold">{totales.paypal} €</p>
                        </div>
                    </div>

                    <br /><br /><br />

                    {/* Beneficio de los Pedidos */}
                    <h2 className="text-4xl font-bold text-center text-white mt-12 mb-6">💰 Beneficio de los Pedidos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaShoppingCart className="text-yellow-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Ingresos Brutos</h2>
                            <p className="text-3xl font-semibold">{beneficioPedidos.ingresos_brutos} €</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaTruck className="text-red-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Costos Totales</h2>
                            <p className="text-3xl font-semibold">{beneficioPedidos.costos} €</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaMoneyBillWave className="text-green-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Beneficio Neto</h2>
                            <p className="text-3xl font-semibold">{parseFloat(beneficioPedidos.ganancia_neta).toFixed(2)} €</p>
                        </div>
                    </div>

                    <br /><br /><br />

                    {/* Gastos en Pedidos a Proveedores */}
                    <h2 className="text-4xl font-bold text-center text-white mt-12 mb-6">📦 Gastos en Proveedores</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaTruck className="text-red-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Total Gastado</h2>
                            <p className="text-3xl font-semibold">{gastosProveedores.total_gastado} €</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaStore className="text-blue-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Total de Pedidos</h2>
                            <p className="text-3xl font-semibold">{gastosProveedores.total_pedidos}</p>
                        </div>
                    </div>

                                <br /><br />
                    <div className="flex justify-center mb-6">
    <button
        onClick={volver}
        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-lg transition duration-300 ease-in-out"
    >
        ⬅️ Volver
    </button>
</div>

                </div>

            </div>

            <SobreNosotros />
            <Footer />
        </div>
    );
}
