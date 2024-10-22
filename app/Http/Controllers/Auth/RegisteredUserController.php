<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\WelcomeMail;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'numero_tarjeta_vip' => 'nullable|string|exists:users,numero_tarjeta_vip',
        ]);

        // Crear el nuevo usuario (cliente)
        $user = User::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => 'cliente',  // O 'admin' si es un administrador
            'saldo' => 0,
        ]);

        // Si fue referido por otro cliente (tarjeta VIP), actualizamos el saldo
        if ($request->filled('numero_tarjeta_vip')) {
            $referente = User::where('numero_tarjeta_vip', $request->numero_tarjeta_vip)->first();

            if ($referente) {
                $user->saldo += 2;
                $user->referido_por = $referente->numero_tarjeta_vip;
                $user->save();

                $referente->saldo += 2;
                $referente->save();
            }
        }

        // Enviar correo de bienvenida
        Mail::to($user->email)->send(new WelcomeMail($user));

        event(new Registered($user));

        // Autenticar automáticamente al usuario
        Auth::login($user);

        // Redirigir según el rol del usuario
        if ($user->rol === 'admin') {
            return redirect()->route('mi-gestion-admin');  // Si es admin, redirigir a /mi-gestion-admin
        }

        return redirect()->route('mi-cuenta'); // Si es cliente, redirigir a /mi-cuenta
    }
}
