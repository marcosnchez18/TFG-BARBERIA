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
});

// Ruta para mostrar el formulario de login
Route::get('/login', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.authenticate');

// Ruta para mostrar el formulario de registro
Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');

// Ruta para manejar el registro de un cliente
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');

// Rutas protegidas para los dashboards (auth middleware)
Route::middleware(['auth'])->group(function () {
    // Ruta para el dashboard del administrador
    Route::get('/admin/dashboard', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin.dashboard');

    // Ruta para el dashboard del cliente
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});
