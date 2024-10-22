<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
*/

// Ruta para la página principal de bienvenida
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

// Ruta para mostrar el formulario de login
Route::get('/login', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.authenticate');

// Ruta para mostrar el formulario de registro
Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');

// Rutas protegidas para los dashboards
Route::middleware(['auth'])->group(function () {
    Route::get('/mi-cuenta', function () {
        // Verificar el rol del usuario y redirigir
        if (auth()->user()->rol === 'admin') {  // Usar 'rol'
            return redirect()->route('mi-gestion-admin'); // Si es admin, redirigir al dashboard del admin
        }
        return Inertia::render('Dashboard'); // Renderiza el dashboard del cliente
    })->name('mi-cuenta');

    // Ruta para el dashboard del admin
    Route::get('/mi-gestion-admin', function () {
        return Inertia::render('AdminDashboard');
    })->name('mi-gestion-admin');
});

// Otras rutas adicionales
Route::get('/sobre-nosotros', function () {
    return Inertia::render('PaginaSobreNos');
})->name('sobre-nosotros');

Route::get('/servicios', function () {
    return Inertia::render('Servi');
})->name('servicios');

Route::get('/contacto', function () {
    return Inertia::render('Contacto');
})->name('contacto');

Route::get('/equipo', function () {
    return Inertia::render('Equipo');
})->name('equipo');

// Páginas de Daniel y José
Route::get('/daniel', function () {
    return Inertia::render('Daniel');
})->name('daniel');

Route::get('/jose', function () {
    return Inertia::render('Jose');
})->name('jose');

// Ruta para cerrar sesión
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
