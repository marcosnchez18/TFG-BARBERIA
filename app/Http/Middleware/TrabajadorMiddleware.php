<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TrabajadorMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Verificar si el usuario tiene el rol de 'trabajador'
        if (Auth::check() && Auth::user()->role === 'trabajador') {
            return $next($request);
        }

        // Si no es trabajador, redirigir o devolver error 403
        return abort(403); // O redirigir: return redirect('/');
    }
}
