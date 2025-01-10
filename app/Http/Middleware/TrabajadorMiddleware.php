<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TrabajadorMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->rol === 'trabajador') {
            return $next($request); // Permitir acceso si es trabajador
        }

        return abort(403); // Redirigir si no es trabajador
    }
}
