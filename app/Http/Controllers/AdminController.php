<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cita;
use App\Models\Servicio;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function dashboard()
    {
        $barberoId = Auth::id();
        $today = Carbon::today();
        $startOfMonth = $today->copy()->startOfMonth();
        $endOfMonth = $today->copy()->endOfMonth();

        // Mes actual en español
        $nombreMesActual = $today->locale('es')->translatedFormat('F');

        // Contar citas de hoy para el barbero logueado
        $citasHoy = Cita::whereDate('fecha_hora_cita', $today)
            ->where('barbero_id', $barberoId)
            ->count();

        // Contar usuarios nuevos hoy con rol de cliente
        $nuevosUsuariosHoy = User::where('rol', 'cliente')
            ->whereDate('created_at', $today)
            ->count();

        // Ganancias del mes actual basadas en la columna precio_cita
        $gananciasMes = Cita::where('barbero_id', $barberoId)
            ->whereBetween('fecha_hora_cita', [$startOfMonth, $endOfMonth])
            ->sum('precio_cita');

        // Calcular valoración media de citas completadas del barbero
        $valoracionMedia = Cita::where('barbero_id', $barberoId)
            ->where('estado', 'completada')
            ->whereNotNull('valoracion')
            ->avg('valoracion');

        return Inertia::render('AdminDashboard', [
            'user' => Auth::user(),
            'citasHoy' => $citasHoy,
            'nuevosUsuariosHoy' => $nuevosUsuariosHoy,
            'gananciasMes' => $gananciasMes,
            'nombreMesActual' => ucfirst($nombreMesActual),
            'valoracionMedia' => $valoracionMedia ? round($valoracionMedia, 2) : 0,

        ]);
    }

    public function citasBarbero()
    {
        if (Auth::user()->rol !== 'admin') {
            return response()->json(['error' => 'Acceso no autorizado'], 403);
        }

        $barberoId = Auth::id();

        // Filtrar las citas pendientes y futuras del barbero logueado
        $citas = Cita::where('barbero_id', $barberoId)
            ->where('fecha_hora_cita', '>=', Carbon::now())
            ->where('estado', 'pendiente')
            ->with(['usuario:id,nombre', 'servicio:id,nombre'])
            ->orderBy('fecha_hora_cita', 'asc')
            ->get();

        return response()->json($citas);
    }

    public function cambiarEstado(Request $request, $id)
{
    $cita = Cita::with('servicio', 'usuario')->findOrFail($id);
    $nuevoEstado = $request->input('estado');

    if (in_array($nuevoEstado, ['completada', 'ausente', 'pendiente'])) {
        $cita->estado = $nuevoEstado;
        $cita->save();

        // Añadir el 2% del precio del servicio al saldo del cliente si el estado es "completada"
        if ($nuevoEstado === 'completada') {
            $cliente = $cita->usuario;
            $precioServicio = $cita->servicio->precio;
            $saldoAAgregar = $precioServicio * 0.02; 
            $cliente->saldo += $saldoAAgregar;
            $cliente->save();
        }

        return response()->json(['success' => true, 'estado' => $nuevoEstado]);
    }

    return response()->json(['success' => false, 'message' => 'Estado no válido'], 400);
}



    public function cancelarCita($id)
{
    $cita = Cita::findOrFail($id);

    // Verifica si la cita tiene un descuento aplicado y devuelve el saldo al usuario
    if ($cita->descuento_aplicado > 0) {
        $usuario = $cita->usuario;
        $usuario->saldo += $cita->descuento_aplicado;
        $usuario->save();
    }

    // Elimina la cita
    $cita->delete();

    return response()->json(['message' => 'Cita cancelada exitosamente.']);
}


    public function citasPorDia($fecha)
    {
        $barberoId = Auth::id();
        $fechaSeleccionada = Carbon::parse($fecha)->startOfDay();

        $citas = Cita::where('barbero_id', $barberoId)
            ->whereDate('fecha_hora_cita', $fechaSeleccionada)
            ->with(['usuario:id,nombre', 'servicio:id,nombre'])
            ->orderBy('fecha_hora_cita', 'asc')
            ->get();

        return response()->json($citas);
    }

    public function quitaSaldo(Request $request)
{
    $request->validate([
        'descuento' => 'required|numeric|min:0',
    ]);

    // Obtenemos al usuario autenticado nuevamente para evitar problemas de sincronización
    $user = User::find(Auth::id());

    if ($user && $user->saldo >= $request->descuento) {
        // Resta el saldo y guarda
        $user->saldo = $user->saldo - $request->descuento;
        $user->update(['saldo' => $user->saldo]);

        return response()->json(['success' => 'Saldo descontado correctamente.'], 200);
    } else {
        return response()->json(['error' => 'Saldo insuficiente o usuario no encontrado.'], 400);
    }
}



public function getSaldo()
{
    $user = Auth::user();


    return response()->json([
        'saldo' => (float) $user->saldo
    ], 200);
}


public function obtenerBarberos()
{
    // Filtrar usuarios con roles 'admin' o 'trabajador' y que estén activos
    $barberos = User::whereIn('rol', ['admin', 'trabajador'])
        ->where('estado', 'activo') // Solo barberos activos
        ->get(['id', 'nombre', 'email', 'rol', 'imagen', 'estado']); // Incluye el estado y la imagen en la respuesta

    return response()->json($barberos);
}


public function createBarbero()
    {
        return Inertia::render('BarberoNuevo', [
            'storeUrl' => route('admin.barberos.store'),
        ]);
    }



    public function store(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:6', // La contraseña debe confirmarse
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validar que la imagen sea válida
        ]);

        // Manejar la imagen si existe
        $imagenPath = null;
        if ($request->hasFile('imagen')) {
            $imagenPath = $request->file('imagen')->store('images', 'public');
        }

        // Crear un nuevo usuario con el rol de "trabajador"
        User::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Encriptar la contraseña
            'rol' => 'trabajador', // Asignar el rol fijo de trabajador
            'imagen' => $imagenPath, // Guardar la ruta de la imagen si se proporcionó
        ]);

        // Redirigir con un mensaje de éxito
        return response()->json(['message' => 'Barbero creado exitosamente'], 201);
    }

    public function editarBarberos()
    {
        // Obtener todos los barberos (usuarios con rol 'trabajador')
        $trabajadores = User::where('rol', 'trabajador')->get();

        // Pasar los datos a la vista
        return inertia('BarberosEditar', ['trabajadores' => $trabajadores]);
    }

    public function deshabilitar($id)
{
    $trabajador = User::findOrFail($id);

    // Verificamos si el usuario es un trabajador antes de actualizar
    if ($trabajador->rol === 'trabajador') {
        $trabajador->update(['estado' => 'inactivo']);
    }

    return redirect()
        ->route('admin.barberos.editar')
        ->with('message', 'Trabajador deshabilitado con éxito.');
}

public function habilitar($id)
{
    $trabajador = User::findOrFail($id);

    // Verificamos si el usuario es un trabajador antes de actualizar
    if ($trabajador->rol === 'trabajador') {
        $trabajador->update(['estado' => 'activo']);
    }

    return redirect()
        ->route('admin.barberos.editar')
        ->with('message', 'Trabajador habilitado con éxito.');
}

public function destroy($id)
{
    $trabajador = User::findOrFail($id);

    // Verificamos si el usuario es un trabajador antes de eliminar
    if ($trabajador->rol === 'trabajador') {
        $trabajador->delete();
    }

    return redirect()
        ->route('admin.barberos.editar')
        ->with('message', 'Trabajador eliminado con éxito.');
}






public function indexTrabajadores()
{
    $trabajadores = User::where('rol', 'trabajador')->get();

    return inertia('TrabajadoresAdmin', [
        'trabajadores' => $trabajadores,
    ]);
}




public function updateField(Request $request, $id)
{
    $request->validate([
        'nombre' => 'nullable|string|max:255',
        'email' => 'nullable|email|max:255',
    ]);

    $trabajador = User::findOrFail($id);

    if ($request->has('nombre')) {
        $trabajador->nombre = $request->nombre;
    }

    if ($request->has('email')) {
        $trabajador->email = $request->email;
    }

    $trabajador->save();

    return redirect()->back()->with('success', 'Campo actualizado con éxito.');
}


public function updatePhoto(Request $request, $id)
{
    $request->validate([
        'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $trabajador = User::findOrFail($id);

    if ($request->hasFile('imagen')) {
        $path = $request->file('imagen')->store('public/trabajadores');
        $trabajador->imagen = str_replace('public/', '', $path);
    }

    $trabajador->save();

    return redirect()->back()->with('success', 'Foto actualizada con éxito.');
}

public function getServiciosPorBarbero($barberoId)
    {
        $barbero = User::findOrFail($barberoId);

        // Verificar que el usuario sea un barbero
        if (!in_array($barbero->rol, ['admin', 'trabajador'])) {
            return response()->json(['message' => 'Este usuario no es un barbero.'], 400);
        }

        // Obtener servicios asignados desde la relación en la tabla pivote
        $servicios = $barbero->servicios()->get(['id', 'nombre', 'descripcion', 'precio', 'duracion']);

        return response()->json($servicios);
    }


    public function citasBarberia(Request $request)
{
    // Obtener los filtros del request
    $barberoId = $request->input('barbero_id');
    $servicioId = $request->input('servicio_id');
    $estado = $request->input('estado');
    $fechaDia = $request->input('fecha_dia'); // Formato: YYYY-MM-DD
    $fechaMes = $request->input('fecha_mes'); // Formato: YYYY-MM

    // Construir la consulta con filtros
    $query = Cita::with(['usuario', 'barbero', 'servicio']);

    if ($barberoId) {
        $query->where('barbero_id', $barberoId);
    }
    if ($servicioId) {
        $query->where('servicio_id', $servicioId);
    }
    if ($estado) {
        $query->where('estado', $estado);
    }
    if ($fechaDia) {
        $query->whereDate('fecha_hora_cita', $fechaDia);
    }
    if ($fechaMes) {
        $query->whereYear('fecha_hora_cita', substr($fechaMes, 0, 4))
              ->whereMonth('fecha_hora_cita', substr($fechaMes, 5, 2));
    }

    // Obtener los resultados
    $citas = $query->get();

    return response()->json($citas);
}


public function cambiarMetodoPago(Request $request, $id)
{
    $cita = Cita::findOrFail($id);

    // Validar el método de pago
    $request->validate([
        'metodo_pago' => ['required', 'in:efectivo,tarjeta'],
    ]);

    // Actualizar el método de pago
    $cita->metodo_pago = $request->metodo_pago;
    $cita->save();

    return response()->json(['message' => 'Método de pago actualizado']);
}



public function misDatos()
    {
        $admin = auth()->user(); // Obtiene el usuario autenticado (admin)

        return Inertia::render('MisDatosAdmin', [
            'admin' => $admin,
        ]);
    }

    // Actualizar los datos del administrador
    public function actualizarDatos(Request $request)
    {
        // Validar los datos
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
        ]);

        // Actualizar los datos usando Query Builder
        DB::table('users')
            ->where('id', auth()->id())
            ->update([
                'nombre' => $request->input('nombre'),
                'email' => $request->input('email'),
                'updated_at' => now(),
            ]);

        // Retornar respuesta compatible con Inertia
        return back()->with('success', 'Datos actualizados correctamente.');
    }


    public function actualizarFoto(Request $request, $id)
{
    $request->validate([
        'imagen' => 'required|image|mimes:jpg,jpeg,png|max:2048', // Valida que sea una imagen
    ]);

    $admin = User::findOrFail($id); // Encuentra al administrador por su ID

    // Elimina la foto anterior si no es la predeterminada
    if ($admin->imagen && $admin->imagen !== '/images/default-avatar.png') {
        Storage::delete($admin->imagen);
    }

    // Guarda la nueva foto
    $path = $request->file('imagen')->store('public/perfiles'); // Guardar en la carpeta "perfiles"
    $admin->imagen = Storage::url($path); // Almacena la URL de acceso público en la base de datos
    $admin->save();

    return back()->with('success', 'Foto de perfil actualizada correctamente.');
}


}


