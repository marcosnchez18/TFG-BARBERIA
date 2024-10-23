<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
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

// Rutas para verificación de email
Route::get('/email/verify', function () {
    return Inertia::render('Auth/VerifyEmail'); // Página que indica que verifiquen su correo
})->middleware('auth')->name('verification.notice');

// Ruta para verificar el email al hacer clic en el enlace del correo
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill(); // Marca el email como verificado
    return redirect('/mi-cuenta'); // Redirige a la página de la cuenta del usuario
})->middleware(['auth', 'signed'])->name('verification.verify');

// Ruta para reenviar el enlace de verificación
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('message', 'El enlace de verificación ha sido reenviado.');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

// Rutas protegidas para los dashboards (solo usuarios autenticados y verificados)
Route::middleware(['auth', 'verified'])->group(function () {
    // Ruta para el dashboard del cliente
    Route::get('/mi-cuenta', function () {
        // Verificar el rol del usuario y redirigir
        if (auth()->user()->rol === 'admin') {
            return redirect()->route('mi-gestion-admin'); // Si es admin, redirigir al dashboard del admin
        }
        return Inertia::render('Dashboard'); // Renderiza el dashboard del cliente
    })->name('mi-cuenta');

    // Ruta para el dashboard del admin
    Route::get('/mi-gestion-admin', function () {
        return Inertia::render('AdminDashboard');
    })->name('mi-gestion-admin');

    // Otras rutas protegidas que solo pueden ser accedidas tras autenticar
    Route::get('/reservar-cita', function () {
        return Inertia::render('ReservarCitaCliente');
    })->name('reservar-cita');

    Route::get('/mis-citas', function () {
        return Inertia::render('MisCitasClientes');
    })->name('mis-citas');

    Route::get('/mis-datos', function () {
        return Inertia::render('MisDatosClientes');
    })->name('mis-datos');
});

// Rutas para restablecimiento de contraseña
Route::get('/forgot-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('/reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');

// Otras rutas adicionales (páginas públicas)
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
