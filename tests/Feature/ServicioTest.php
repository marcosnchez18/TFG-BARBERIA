<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Servicio;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ServicioTest extends TestCase
{
    use DatabaseTransactions; // No borra la base de datos, solo revierte cambios después del test

    /** @test */
    public function un_administrador_puede_crear_un_nuevo_servicio()
    {
        // Crear un usuario administrador
        $admin = User::factory()->create([
            'nombre' => 'Admin Test',
            'rol' => 'admin',
            'estado' => 'activo'
        ]);

        // Crear un barbero
        $barbero = User::factory()->create([
            'nombre' => 'Barbero Test',
            'rol' => 'trabajador',
            'estado' => 'activo'
        ]);

        // Datos del servicio a crear
        $datosServicio = [
            'nombre' => 'Corte Clásico',
            'descripcion' => 'Un corte de pelo tradicional con un acabado moderno.',
            'precio' => 25.00,
            'duracion' => 30,
            'barbero' => $barbero->id,
        ];

        // Enviar la solicitud POST como el administrador
        $response = $this->actingAs($admin)
            ->post(route('admin.servicios.store'), $datosServicio);

        // Verificar que redirige correctamente y muestra mensaje de éxito
        $response->assertRedirect(route('admin.servicios.create'));
        $response->assertSessionHas('success', 'Servicio creado correctamente.');

        // Verificar que el servicio se haya guardado en la base de datos
        $this->assertDatabaseHas('servicios', [
            'nombre' => 'Corte Clásico',
            'descripcion' => 'Un corte de pelo tradicional con un acabado moderno.',
            'precio' => 25.00,
            'duracion' => 30,
        ]);

        // Verificar que el servicio está relacionado con el barbero en la tabla pivote
        $servicio = Servicio::where('nombre', 'Corte Clásico')->first();
        $this->assertTrue($servicio->barberos->contains($barbero));
    }

    /** @test */
    public function no_se_puede_crear_un_servicio_con_datos_invalidos()
    {
        // Crear un usuario administrador
        $admin = User::factory()->create([
            'nombre' => 'Admin Test',
            'rol' => 'admin',
            'estado' => 'activo'
        ]);

        // Enviar una solicitud POST con datos incompletos
        $response = $this->actingAs($admin)
            ->post(route('admin.servicios.store'), []);

        // Verificar que los errores de validación aparecen en la sesión
        $response->assertSessionHasErrors(['nombre', 'precio', 'duracion', 'barbero']);
    }
}
