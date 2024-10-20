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
            if ($user->rol === 'admin') {
                return redirect()->route('admin.dashboard'); // Redirigir al dashboard de admin
            }

            return redirect()->route('dashboard'); // Redirigir al dashboard de cliente
        }

        return back()->withErrors([
            'email' => 'Las credenciales no coinciden con nuestros registros.',
        ]);
    }
}
