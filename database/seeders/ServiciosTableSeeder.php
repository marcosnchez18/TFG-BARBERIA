<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiciosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $servicios = [
            [
                'nombre' => 'Corte de Pelo',
                'descripcion' => 'Nuestros cortes de pelo están diseñados para resaltar tu estilo único, cuidando cada detalle para asegurar que salgas luciendo perfecto.',
                'precio' => 12.00,
                'duracion' => 45,
            ],
            [
                'nombre' => 'Afeitado Clásico',
                'descripcion' => 'Disfruta de un afeitado tradicional con navaja y espuma caliente, para una experiencia de barbería como ninguna otra.',
                'precio' => 4.00,
                'duracion' => 45,
            ],
            [
                'nombre' => 'Arreglo de Barba',
                'descripcion' => 'Déjanos cuidar de tu barba con precisión y dedicación, logrando un estilo impecable que combine con tu look personal.',
                'precio' => 6.00,
                'duracion' => 45,
            ],
            [
                'nombre' => 'Corte + Barba',
                'descripcion' => 'Un servicio completo que incluye corte de pelo y arreglo de barba, perfecto para quienes buscan un estilo definido.',
                'precio' => 15.00,
                'duracion' => 45,
            ],
            [
                'nombre' => 'Depilado de Cejas',
                'descripcion' => 'Contamos con las técnicas más avanzadas para que tus cejas luzcan bien definidas y se ajusten a tu rostro.',
                'precio' => 4.00,
                'duracion' => 45,
            ],
            [
                'nombre' => 'Champoo + Estilo',
                'descripcion' => 'Nuestro servicio de lavado de cabello incluye un peinado a medida para que te sientas renovado y fresco.',
                'precio' => 5.00,
                'duracion' => 45,
            ],
            [
                'nombre' => 'Alisado de Keratina',
                'descripcion' => 'Devuelve la vitalidad a tu cabello con nuestro alisado de keratina, ideal para eliminar el frizz y mejorar la salud del cabello.',
                'precio' => 50.00,
                'duracion' => 45,
            ],
            [
                'nombre' => 'Mechas',
                'descripcion' => '¿Te gustaría darle un toque de color a tu cabello? Nuestras mechas están hechas con los mejores productos del mercado.',
                'precio' => 7.00,
                'duracion' => 45,
            ],
            [
                'nombre' => 'Corte + Barba + Cejas + Lavado',
                'descripcion' => 'Un paquete completo que incluye corte de pelo, barba, cejas y lavado, perfecto para un cambio total de look.',
                'precio' => 20.00,
                'duracion' => 45,
            ],
        ];

        DB::table('servicios')->insert($servicios);
    }
}
