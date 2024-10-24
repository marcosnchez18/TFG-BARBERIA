<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    // Muestra el formulario de inicio de sesión
    public function create()
    {
        return inertia('Auth/Login');
    }

    // Maneja la autenticación
    public function store(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // Redirigir según el rol del usuario
            if ($user->rol === 'admin') {  // Usar 'rol' en lugar de 'role'
                return redirect()->route('mi-gestion-admin'); // Redirigir al dashboard del admin
            }

            return redirect()->route('mi-cuenta'); // Redirigir al dashboard del cliente
        }

        return back()->withErrors([
            'email' => 'Las credenciales no coinciden con nuestros registros.',
        ]);
    }

    // Maneja el cierre de sesión
    public function logout(Request $request)
    {
        Auth::logout(); // Cierra la sesión

        // Invalida la sesión actual y regenera el token CSRF para mayor seguridad
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirige al usuario a la página de inicio (home)
        return redirect()->route('home');
    }
}
