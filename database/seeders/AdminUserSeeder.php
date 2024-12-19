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
                'email' => 'gerotayi@gmail.com',
                'password' => Hash::make('admin'),
                'rol' => 'admin',
                'saldo' => 0,
                'estado' => 'activo',
                'numero_tarjeta_vip' => 'JA1111111',
                'referido_por' => null,
                'imagen' => 'images/jose.png',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Daniel Valle Vargas',
                'email' => 'ermenegulfo@gmail.com',
                'password' => Hash::make('admin'),
                'rol' => 'admin',
                'saldo' => 0,
                'estado' => 'activo',
                'numero_tarjeta_vip' => 'DV2222222',
                'referido_por' => null,
                'imagen' => 'images/hector.png',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
