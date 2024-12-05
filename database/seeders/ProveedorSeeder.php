<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProveedorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Insertar 10 proveedores
        DB::table('proveedores')->insert([
            [
                'nombre' => 'Proveedor 1',
                'contacto' => 'Juan Pérez',
                'telefono' => '123456789',
                'email' => 'juan@proveedor1.com',
                'direccion' => 'Calle Ficticia 123, Ciudad, País',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Proveedor 2',
                'contacto' => 'María García',
                'telefono' => '987654321',
                'email' => 'maria@proveedor2.com',
                'direccion' => 'Avenida Real 456, Ciudad, País',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Proveedor 3',
                'contacto' => 'Carlos López',
                'telefono' => '555555555',
                'email' => 'carlos@proveedor3.com',
                'direccion' => 'Plaza Mayor 789, Ciudad, País',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Proveedor 4',
                'contacto' => 'Ana Martínez',
                'telefono' => '234567890',
                'email' => 'ana@proveedor4.com',
                'direccion' => 'Calle Sol 112, Ciudad, País',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Proveedor 5',
                'contacto' => 'Pedro Sánchez',
                'telefono' => '876543210',
                'email' => 'pedro@proveedor5.com',
                'direccion' => 'Calle Luna 223, Ciudad, País',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Proveedor 6',
                'contacto' => 'Laura Fernández',
                'telefono' => '345678901',
                'email' => 'laura@proveedor6.com',
                'direccion' => 'Calle Estrella 334, Ciudad, País',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Proveedor 7',
                'contacto' => 'José Rodríguez',
                'telefono' => '567890123',
                'email' => 'jose@proveedor7.com',
                'direccion' => 'Calle Primavera 445, Ciudad, País',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Proveedor 8',
                'contacto' => 'Lucía González',
                'telefono' => '678901234',
                'email' => 'lucia@proveedor8.com',
                'direccion' => 'Avenida del Mar 556, Ciudad, País',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Proveedor 9',
                'contacto' => 'Andrés Ruiz',
                'telefono' => '789012345',
                'email' => 'andres@proveedor9.com',
                'direccion' => 'Calle Océano 667, Ciudad, País',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Proveedor 10',
                'contacto' => 'Sara Díaz',
                'telefono' => '890123456',
                'email' => 'sara@proveedor10.com',
                'direccion' => 'Avenida de la Luna 778, Ciudad, País',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
