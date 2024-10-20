<?php

// app/Http/Middleware/ClienteMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClienteMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->rol === 'cliente') {
            return $next($request); // Permitir acceso si es cliente
        }

        return redirect('/'); // Redirigir si no es cliente
    }
}
