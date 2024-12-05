<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Producto::create([
            'nombre' => 'Máquina de Cortar Cabello',
            'descripcion' => 'Máquina profesional para cortar cabello, incluye varias cuchillas de ajuste.',
            'precio' => 49.99,
            'stock' => 100,
            'proveedor_id' => 3,
            'imagen' => 'https://via.placeholder.com/400x400?text=Maquina+Cortar+Cabello',
        ]);

        Producto::create([
            'nombre' => 'Gel para Cabello',
            'descripcion' => 'Gel fijador para cabello, ideal para crear estilos duraderos.',
            'precio' => 9.99,
            'stock' => 200,
            'proveedor_id' => 8,
            'imagen' => 'https://via.placeholder.com/400x400?text=Gel+Cabello',
        ]);

        Producto::create([
            'nombre' => 'Cera para Barba',
            'descripcion' => 'Cera natural para mantener la barba bien arreglada durante todo el día.',
            'precio' => 12.99,
            'stock' => 150,
            'proveedor_id' => 3,
            'imagen' => 'https://via.placeholder.com/400x400?text=Cera+para+Barba',
        ]);

        Producto::create([
            'nombre' => 'Peine Profesional',
            'descripcion' => 'Peine de alta calidad para cortes precisos y estilizados.',
            'precio' => 5.99,
            'stock' => 300,
            'proveedor_id' => 4,
            'imagen' => 'https://via.placeholder.com/400x400?text=Peine+Profesional',
        ]);

        Producto::create([
            'nombre' => 'Shampoo Capilar',
            'descripcion' => 'Shampoo para cabello que limpia y revitaliza el cuero cabelludo.',
            'precio' => 14.99,
            'stock' => 120,
            'proveedor_id' => 5,
            'imagen' => 'https://via.placeholder.com/400x400?text=Shampoo+Capilar',
        ]);

        Producto::create([
            'nombre' => 'Aceite para Barba',
            'descripcion' => 'Aceite nutritivo para mantener la barba suave e hidratada.',
            'precio' => 19.99,
            'stock' => 80,
            'proveedor_id' => 6,
            'imagen' => 'https://via.placeholder.com/400x400?text=Aceite+para+Barba',
        ]);

        Producto::create([
            'nombre' => 'Tijeras de Corte',
            'descripcion' => 'Tijeras de calidad profesional para cortes de cabello precisos.',
            'precio' => 29.99,
            'stock' => 60,
            'proveedor_id' => 7,
            'imagen' => 'https://via.placeholder.com/400x400?text=Tijeras+de+Corte',
        ]);

        Producto::create([
            'nombre' => 'Rastrillo de Afeitar',
            'descripcion' => 'Rastrillo de afeitar con hojas reemplazables para un afeitado suave.',
            'precio' => 15.99,
            'stock' => 150,
            'proveedor_id' => 8,
            'imagen' => 'https://via.placeholder.com/400x400?text=Rastrillo+de+Afeitar',
        ]);

        Producto::create([
            'nombre' => 'Espuma de Afeitar',
            'descripcion' => 'Espuma rica y cremosa para un afeitado sin irritaciones.',
            'precio' => 6.99,
            'stock' => 180,
            'proveedor_id' => 9,
            'imagen' => 'https://via.placeholder.com/400x400?text=Espuma+de+Afeitar',
        ]);

        Producto::create([
            'nombre' => 'Cuchillas de Afeitar',
            'descripcion' => 'Cuchillas de afeitar de repuesto, paquete de 5 unidades.',
            'precio' => 4.99,
            'stock' => 500,
            'proveedor_id' => 10,
            'imagen' => 'https://via.placeholder.com/400x400?text=Cuchillas+de+Afeitar',
        ]);
    }
}
