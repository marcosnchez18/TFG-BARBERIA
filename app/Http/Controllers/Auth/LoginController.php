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

            // Verificar si el usuario está inactivo
            if ($user->estado === 'inactivo') {
                Auth::logout(); // Cerrar la sesión inmediatamente
                return redirect()->route('account.inactive'); // Redirigir a la página de cuenta inactiva
            }

            // Redirigir según el rol del usuario
            return redirect()->route($user->rol === 'admin' ? 'mi-gestion-admin' : 'mi-cuenta');
        }

        // Si las credenciales no son válidas, devolver un error
        return back()->withErrors([
            'email' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
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
