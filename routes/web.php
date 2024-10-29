<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\NoticiaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\CitaController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Ruta para la página principal de bienvenida
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

// Rutas de autenticación
Route::get('/login', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.authenticate');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Página para cuentas inactivas
Route::get('/account-inactive', function () {
    return Inertia::render('AccountInactive', [
        'message' => 'UPS !! Tu cuenta está desactivada por conductas inapropiadas. Si desea recuperarla, contacte con nosotros.',
    ]);
})->name('account.inactive');

// Registro de usuario
Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');

// Rutas para verificación de email
Route::get('/email/verify', function () {
    return Inertia::render('Auth/VerifyEmail');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect()->route('mi-cuenta');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('message', 'El enlace de verificación ha sido reenviado.');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

// Rutas protegidas para dashboards y datos de clientes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard del cliente
    Route::get('/mi-cuenta', function () {
        if (auth()->user()->rol === 'admin') {
            return redirect()->route('mi-gestion-admin');
        }
        return Inertia::render('Dashboard', ['user' => auth()->user()]);
    })->name('mi-cuenta');

    // Dashboard del administrador
    Route::get('/mi-gestion-admin', function () {
        return Inertia::render('AdminDashboard', ['user' => auth()->user()]);
    })->name('mi-gestion-admin');

    // Rutas de gestión de citas, foro y clientes para el administrador
    Route::get('/admin/citas', function () {
        return Inertia::render('CitasAdmin');
    })->name('admin-citas');

    // Foro de noticias del administrador
    Route::get('/admin/foro', [NoticiaController::class, 'index'])->name('admin-foro');
    Route::post('/admin/foro', [NoticiaController::class, 'store'])->name('noticias.store');
    Route::put('/admin/foro/{noticia}', [NoticiaController::class, 'update'])->name('noticias.update');
    Route::delete('/admin/foro/{noticia}', [NoticiaController::class, 'destroy'])->name('noticias.destroy');

    // Gestión de clientes para el administrador
    Route::get('/admin/clientes', [ClienteController::class, 'index'])->name('admin-clientes');
    Route::delete('/admin/clientes/{id}', [ClienteController::class, 'destroy'])->name('clientes.destroy');
    Route::patch('/admin/clientes/{id}/deshabilitar', [ClienteController::class, 'deshabilitar'])->name('clientes.deshabilitar');
    Route::patch('/admin/clientes/{id}/habilitar', [ClienteController::class, 'habilitar'])->name('clientes.habilitar');

    // Rutas para el cliente (incluyendo edición de datos)
    Route::get('/reservar-cita', [NoticiaController::class, 'showNoticias'])->name('reservar-cita');
    Route::get('/mis-citas', function () {
        return Inertia::render('MisCitasCliente');
    })->name('mis-citas');
    Route::get('/mis-citas/elegir', function () {
        return Inertia::render('ElegirCita');
    })->name('mis-citas-elegir');

    // Rutas para disponibilidad y reserva de citas
    Route::get('/api/citas/disponibilidad', [CitaController::class, 'disponibilidad'])->name('citas.disponibilidad');
    Route::post('/citas/reservar', [CitaController::class, 'reservar'])->name('citas.reservar');

    // Mostrar y actualizar datos del cliente en la ruta /mis-datos
    Route::get('/mis-datos', [ClienteController::class, 'edit'])->name('mis-datos');
    Route::patch('/mis-datos', [ClienteController::class, 'update'])->name('cliente.update');
});

// Rutas para restablecimiento de contraseña
Route::get('/forgot-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('/reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');

// Rutas adicionales (públicas)
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

// Páginas personales de Daniel y José
Route::get('/daniel', function () {
    return Inertia::render('Daniel');
})->name('daniel');

Route::get('/jose', function () {
    return Inertia::render('Jose');
})->name('jose');
