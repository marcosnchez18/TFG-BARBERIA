<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckActiveAccount
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Verificar si el usuario está autenticado y su estado es "inactivo"
        if (Auth::check() && Auth::user()->estado === 'inactivo') {
            // Redirigir a la vista de cuenta inactiva con el mensaje adecuado
            return redirect()->route('account.inactive');
        }

        return $next($request);
    }
}
