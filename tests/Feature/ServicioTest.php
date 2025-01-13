<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Servicio;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ServicioTest extends TestCase
{
    use DatabaseTransactions;

    /** @test */
    public function un_administrador_puede_crear_un_nuevo_servicio()
    {
        // Crear un usuario administrador
        $admin = User::factory()->create(['rol' => 'admin', 'estado' => 'activo']);

        // Crear un barbero
        $barbero = User::factory()->create(['rol' => 'trabajador', 'estado' => 'activo']);

        // Datos del servicio a crear
        $datosServicio = [
            'nombre' => 'Corte Clásico',
            'descripcion' => 'Un corte de pelo tradicional con un acabado moderno.',
            'precio' => 25.00,
            'duracion' => 30,
            'barbero' => $barbero->id,
        ];

        // Enviar la solicitud POST como el administrador
        $this->actingAs($admin)
            ->post(route('admin.servicios.store'), $datosServicio)
            ->assertRedirect(route('admin.servicios.create')) // Comprobamos que redirige correctamente
            ->assertSessionHas('success', 'Servicio creado correctamente.');

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
        $admin = User::factory()->create(['rol' => 'admin', 'estado' => 'activo']);

        // Enviar una solicitud POST con datos incompletos
        $this->actingAs($admin)
            ->post(route('admin.servicios.store'), [])
            ->assertSessionHasErrors(['nombre', 'precio', 'duracion', 'barbero']);
    }

    /** @test */
    public function un_cliente_no_puede_crear_un_servicio()
    {
        // Crear un usuario con rol de cliente
        $cliente = User::factory()->create(['rol' => 'cliente', 'estado' => 'activo']);

        // Crear un barbero
        $barbero = User::factory()->create(['rol' => 'trabajador', 'estado' => 'activo']);

        // Datos del servicio a crear
        $datosServicio = [
            'nombre' => 'Corte VIP',
            'descripcion' => 'Un corte de pelo exclusivo con acabado premium.',
            'precio' => 35.00,
            'duracion' => 45,
            'barbero' => $barbero->id,
        ];

        // Intentar crear un servicio como cliente (debe fallar con un código 403)
        $this->actingAs($cliente)
            ->post(route('admin.servicios.store'), $datosServicio)
            ->assertStatus(403); // El usuario no autorizado debe recibir un error 403
    }
}
