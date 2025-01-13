<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Oferta;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class OfertaTest extends TestCase
{
    use DatabaseTransactions; // Evita borrar la base de datos completa

    /** @test */
    public function un_administrador_puede_crear_una_oferta_de_empleo()
    {
        // Crear usuario administrador
        $admin = User::factory()->create(['rol' => 'admin', 'estado' => 'activo']);

        // Datos válidos de la oferta
        $datosOferta = [
            'nombre' => 'Barbero Profesional',
            'descripcion' => 'Buscamos un barbero con experiencia en cortes clásicos y modernos.',
            'duracion_meses' => 6,
            'numero_vacantes' => 2,
        ];

        // Enviar la solicitud POST autenticado como admin
        $this->actingAs($admin)
            ->post(route('ofertas.store'), $datosOferta)
            ->assertRedirect(route('ofertas.index')) // Redirige tras éxito
            ->assertSessionHas('success', 'Oferta publicada con éxito.');

        // Verificar que la oferta se guardó en la base de datos
        $this->assertDatabaseHas('ofertas', [
            'nombre' => 'Barbero Profesional',
            'descripcion' => 'Buscamos un barbero con experiencia en cortes clásicos y modernos.',
            'duracion_meses' => 6,
            'numero_vacantes' => 2,
        ]);
    }

    /** @test */
    public function solo_los_administradores_pueden_crear_una_oferta_de_empleo()
    {
        // Crear usuario normal (cliente)
        $cliente = User::factory()->create(['rol' => 'cliente', 'estado' => 'activo']);

        // Datos válidos de la oferta
        $datosOferta = [
            'nombre' => 'Aprendiz de Barbero',
            'descripcion' => 'Se busca aprendiz con ganas de aprender en un entorno profesional.',
            'duracion_meses' => 3,
            'numero_vacantes' => 1,
        ];

        // Intentar crear oferta con usuario cliente (debe fallar)
        $this->actingAs($cliente)
            ->post(route('ofertas.store'), $datosOferta)
            ->assertStatus(403); // Código 403: Prohibido

        // Verificar que la oferta NO se guardó en la base de datos
        $this->assertDatabaseMissing('ofertas', [
            'nombre' => 'Aprendiz de Barbero',
        ]);
    }

    /** @test */
    public function no_se_puede_crear_una_oferta_con_datos_invalidos()
    {
        // Crear usuario administrador
        $admin = User::factory()->create(['rol' => 'admin', 'estado' => 'activo']);

        // Datos inválidos (faltan campos)
        $datosOfertaInvalida = [
            'nombre' => '',
            'descripcion' => '',
            'duracion_meses' => 0,
            'numero_vacantes' => 0,
        ];

        // Intentar crear una oferta inválida (debe fallar)
        $this->actingAs($admin)
            ->post(route('ofertas.store'), $datosOfertaInvalida)
            ->assertStatus(302) // Laravel redirige tras fallo de validación
            ->assertSessionHasErrors(['nombre', 'descripcion', 'duracion_meses', 'numero_vacantes']);

        // Verificar que la oferta NO se guardó en la base de datos
        $this->assertDatabaseMissing('ofertas', [
            'nombre' => '',
        ]);
    }
}
