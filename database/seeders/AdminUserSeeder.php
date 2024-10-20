<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            [
                'nombre' => 'José Ángel Sánchez Harana',
                'email' => 'gerotay@gmail.com',
                'password' => Hash::make('admin'),
                'rol' => 'admin',
                'saldo' => 0,
                'contador_ausencias' => 0,
                'estado' => 'activo',
                'numero_tarjeta_vip' => null,
                'referido_por' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Daniel Valle Vargas',
                'email' => 'ermenegulfo@gmail.com',
                'password' => Hash::make('admin'),
                'rol' => 'admin',
                'saldo' => 0,
                'contador_ausencias' => 0,
                'estado' => 'activo',
                'numero_tarjeta_vip' => null,
                'referido_por' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
