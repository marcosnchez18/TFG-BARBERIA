<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClienteController extends Controller
{
    // Método para mostrar todos los clientes
    public function index()
    {
        $clientes = User::where('rol', 'cliente')
            ->get(['id', 'nombre', 'email', 'numero_tarjeta_vip', 'saldo', 'contador_ausencias', 'estado']);

        return Inertia::render('ClientesAdmin', [
            'clientes' => $clientes
        ]);
    }

    // Método para eliminar un cliente
    public function destroy($id)
    {
        $cliente = User::findOrFail($id);
        $cliente->delete();

        return redirect()->route('admin-clientes')->with('message', 'Cliente eliminado con éxito.');
    }

    public function deshabilitar($id)
    {
        $cliente = User::findOrFail($id);
        $cliente->update(['estado' => 'inactivo']);
        return redirect()->route('admin-clientes')->with('message', 'Cliente deshabilitado con éxito.');
    }

    public function habilitar($id)
    {
        $cliente = User::findOrFail($id);
        $cliente->update(['estado' => 'activo']);
        return redirect()->route('admin-clientes')->with('message', 'Cliente habilitado con éxito.');
    }

    // Mostrar los datos del cliente en la vista de edición
    public function edit(Request $request)
    {
        $cliente = $request->user();

        return Inertia::render('MisDatosCliente', [
            'cliente' => [
                'id' => $cliente->id,
                'nombre' => $cliente->nombre,
                'email' => $cliente->email,
                'saldo' => $cliente->saldo,
                'numero_tarjeta_vip' => $cliente->numero_tarjeta_vip,
                'referido_por' => $cliente->referido_por ?? null,
            ],
        ]);
    }

    // Actualizar los datos del cliente
    public function update(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
        ]);

        $user = $request->user();
        $user->update($request->only('nombre', 'email'));

        // Verificar si se cambió el email
        if ($user->wasChanged('email')) {
            $user->email_verified_at = null; // Marcar email como no verificado
            $user->save();
            $user->sendEmailVerificationNotification(); // Enviar enlace de verificación
        }

        return redirect()->back()->with('success', 'Datos actualizados correctamente.');
    }

    public function eliminarCuenta()
{
    $user = Auth::id();
    $user_actual = User::findOrFail($user);
    Auth::logout();
    $user_actual->delete();

    return redirect('/')->with('message', 'Cuenta eliminada con éxito.');
}



}
