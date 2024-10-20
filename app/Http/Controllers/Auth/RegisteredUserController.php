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
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

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
            'nombre' => 'required|string|max:255', // Cambiamos 'name' a 'nombre'
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'numero_tarjeta_vip' => 'nullable|string|exists:users,numero_tarjeta_vip',
        ]);

        // Crear el nuevo usuario (cliente)
        $user = User::create([
            'nombre' => $request->nombre, // Guardamos en la columna 'nombre'
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => 'cliente',
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

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}
