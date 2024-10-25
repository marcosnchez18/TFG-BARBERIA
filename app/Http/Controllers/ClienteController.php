<?php

// ClienteController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    // Método para mostrar todos los clientes
    public function index()
    {
        // Solo clientes con rol 'cliente' y seleccionando campos relevantes
        $clientes = User::where('rol', 'cliente')
            ->select('id', 'nombre', 'email', 'numero_tarjeta_vip', 'saldo', 'contador_ausencias')
            ->get();

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
}
