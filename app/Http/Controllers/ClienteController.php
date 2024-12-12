<?php

namespace App\Http\Controllers;

use App\Models\Ficha;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClienteController extends Controller
{
    // Método para mostrar todos los clientes
    public function index()
    {
        $clientes = User::where('rol', 'cliente')
            ->get(['id', 'nombre', 'email', 'numero_tarjeta_vip', 'saldo', 'estado']);

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
            $user->sendEmailVerificationNotification();
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



public function actualizarDatos(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
    ]);

    $clienteId = auth()->id();

    // Actualizar los datos usando Query Builder
    DB::table('users')
        ->where('id', $clienteId)
        ->update([
            'nombre' => $request->input('nombre'),
            'email' => $request->input('email'),
            'updated_at' => now(),
        ]);

    return Redirect::back()->with('success', 'Datos actualizados correctamente.');
}

public function mostrarFicha($id)
{
    // Obtén el cliente con su ficha asociada
    $cliente = User::with('ficha')->find($id);

    // Verifica si el cliente existe
    if (!$cliente || !$cliente->ficha) {
        return response()->json(['error' => 'Cliente o ficha no encontrado'], 404);
    }

    // Retorna los datos de la ficha del cliente
    return response()->json($cliente->ficha);
}



public function uploadImage(Request $request, $id)
{
    $request->validate([
        'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);


    $ficha = DB::table('fichas')->where('user_id', $id)->first();

    if ($request->hasFile('imagen')) {

        if ($ficha && $ficha->imagen) {
            Storage::disk('public')->delete($ficha->imagen);
        }

        $imagenPath = $request->file('imagen')->store('images', 'public');


        DB::table('fichas')
            ->where('user_id', $id)
            ->update(['imagen' => $imagenPath]);
    }

    return response()->json(['message' => 'Imagen subida correctamente.']);
}







}
