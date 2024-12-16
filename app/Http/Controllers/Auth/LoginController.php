<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

            // Redirigir según el rol del usuario
            return redirect()->route($user->rol === 'admin' ? 'mi-gestion-admin' : 'mi-cuenta');
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
