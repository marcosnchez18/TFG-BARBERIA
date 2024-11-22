<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;

class ForgotPasswordController extends Controller
{
    /**
     * Display the form to request a password reset link.
     */
    public function showLinkRequestForm()
    {
        return Inertia::render('Auth/ForgotPassword'); // Vista de la página para solicitar restablecimiento
    }

    /**
     * Handle sending the password reset link.
     */
    public function sendResetLinkEmail(Request $request)
{
    $request->validate(['email' => 'required|email']);

    // Intentamos enviar el enlace de restablecimiento de contraseña al usuario
    $status = Password::sendResetLink($request->only('email'));

    if ($status === Password::RESET_LINK_SENT) {
        return back()->with('status', __('Un correo de restablecimiento ha sido enviado a tu dirección de email.'));
    }

    return back()->withErrors(['email' => __('No pudimos enviar el enlace a esa dirección de correo.')]);
}

}
