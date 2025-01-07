<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{

    public function create()
    {
        return inertia('Auth/Login');
    }


    public function store(Request $request)
{
    $credentials = $request->only('email', 'password');

    if (Auth::attempt($credentials)) {
        $user = Auth::user();

        // Verificar si el usuario está inactivo
        if ($user->estado === 'inactivo') {
            Auth::logout();
            return redirect()->route('account.inactive');
        }

        // Verificar si hay una ruta guardada en sesión
        $rutaRedireccion = session('ruta_despues_login', null);
        if ($rutaRedireccion) {
            session()->forget('ruta_despues_login'); // Limpiar la sesión después de usarla
            return redirect($rutaRedireccion);
        }

        // Redirigir según el rol del usuario
        if ($user->rol === 'admin') {
            return redirect()->route('mi-gestion-admin');
        } elseif ($user->rol === 'trabajador') {
            return redirect()->route('mi-cuenta-trabajador');
        }

        return redirect()->route('mi-cuenta');
    }

    return back()->withErrors([
        'email' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
    ]);
}




    public function logout(Request $request)
    {
        Auth::logout();


        $request->session()->invalidate();
        $request->session()->regenerateToken();


        return redirect()->route('home');
    }
}
