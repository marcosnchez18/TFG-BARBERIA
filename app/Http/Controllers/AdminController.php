<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cita;
use App\Models\Descanso;
use App\Models\Servicio;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\CancelacionCitaCliente;
use App\Mail\CitaCanceladaPorTrabajador;
use App\Mail\WelcomeMail;
use App\Models\DescansoIndividual;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Log;

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

        return Inertia::render('Admin/AdminDashboard', [
            'user' => Auth::user(),
            'citasHoy' => $citasHoy,
            'nuevosUsuariosHoy' => $nuevosUsuariosHoy,
            'gananciasMes' => $gananciasMes,
            'nombreMesActual' => ucfirst($nombreMesActual),
            'valoracionMedia' => $valoracionMedia ? round($valoracionMedia, 2) : 0,

        ]);
    }

    public function obtenerBarberoLogueado()
{
    $usuario = Auth::user();

    if ($usuario && $usuario->rol === 'trabajador') {
        return response()->json([
            'id' => $usuario->id,
            'nombre' => $usuario->name
        ]);
    }

    return response()->json(['error' => 'No autorizado'], 403);
}

    public function dashboardTrabajador()
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

        return Inertia::render('Trabajador/TrabajadorDashboard', [
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

    public function citasBarberoTrabajador()
    {
        if (Auth::user()->rol !== 'trabajador') {
            return response()->json(['error' => 'Acceso no autorizado'], 403);
        }

        $barberoId = Auth::id();
        $hoy = Carbon::now()->toDateString(); // Obtiene la fecha de hoy en formato YYYY-MM-DD

        // Obtener todas las citas del barbero logueado para hoy (independientemente del estado)
        $citas = Cita::where('barbero_id', $barberoId)
            ->whereDate('fecha_hora_cita', $hoy) // Filtra SOLO las de hoy
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
        $usuario = $cita->usuario;

        // Verifica si el método de pago es adelantado y devuelve el precio de la cita al saldo del usuario
        if ($cita->metodo_pago === 'adelantado') {
            $usuario->saldo += $cita->precio_cita;
            $usuario->save();
        }

        // Verifica si la cita tiene un descuento aplicado y devuelve el saldo al usuario
        if ($cita->descuento_aplicado > 0) {
            $usuario->saldo += $cita->descuento_aplicado;
            $usuario->save();
        }

        // Envía un correo al cliente notificándole la cancelación
        Mail::to($usuario->email)->send(new CancelacionCitaCliente($cita));

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
        return Inertia::render('Admin/BarberoNuevo', [
            'storeUrl' => route('admin.barberos.store'),
        ]);
    }


    public function obtenerGananciasBarbero(Request $request)
{
    try {
        $barberoId = $request->query('barbero_id');
        $mes = $request->query('mes');
        $año = $request->query('año');

        if (!$barberoId || !$mes || !$año) {
            return response()->json(['error' => 'Faltan parámetros'], 400);
        }

        $citas = DB::table('citas')
            ->where('barbero_id', $barberoId)
            ->whereMonth('fecha_hora_cita', $mes)
            ->whereYear('fecha_hora_cita', $año)
            ->where('estado', 'completada')
            ->get();

        if ($citas->isEmpty()) {
            return response()->json([
                'citas_realizadas' => 0,
                'ganancias_totales' => 0,
                'desglose' => [
                    'adelantado' => 0,
                    'tarjeta' => 0,
                    'efectivo' => 0
                ]
            ]);
        }

        $gananciasTotales = $citas->sum('precio_cita');

        $desglose = [
            'adelantado' => $citas->where('metodo_pago', 'adelantado')->sum('precio_cita'),
            'tarjeta' => $citas->where('metodo_pago', 'tarjeta')->sum('precio_cita'),
            'efectivo' => $citas->where('metodo_pago', 'efectivo')->sum('precio_cita')
        ];

        return response()->json([
            'citas_realizadas' => $citas->count(),
            'ganancias_totales' => $gananciasTotales,
            'desglose' => $desglose
        ]);
    } catch (\Exception $e) {
        Log::error("Error obteniendo ganancias del barbero: " . $e->getMessage());
        return response()->json(['error' => 'Error interno del servidor'], 500);
    }
}





public function store(Request $request)
{
    // Validar los datos del formulario
    $request->validate([
        'nombre' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|confirmed|min:6',
        'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Manejar la imagen si existe
    $imagenPath = null;
    if ($request->hasFile('imagen')) {
        $imagenPath = $request->file('imagen')->store('images', 'public');
    }

    // Crear un nuevo usuario con el rol de "trabajador" y marcarlo como verificado
    $user = User::create([
        'nombre' => $request->nombre,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'rol' => 'trabajador',
        'imagen' => $imagenPath,
        'email_verified_at' => Carbon::now(),
    ]);

    // Redirigir con un mensaje de éxito sin enviar correo de verificación
    return response()->json([
        'message' => 'Barbero creado exitosamente con email verificado',
        'user' => $user
    ], 201);
}



    public function editarBarberos()
    {
        // Obtener todos los barberos (usuarios con rol 'trabajador')
        $trabajadores = User::where('rol', 'trabajador')->get();

        // Pasar los datos a la vista
        return inertia('Admin/BarberosEditar', ['trabajadores' => $trabajadores]);
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
        // Obtener citas pendientes del trabajador
        $citasPendientes = Cita::where('barbero_id', $trabajador->id)
            ->where('estado', 'pendiente')
            ->get();

        // Procesar cada cita pendiente
        foreach ($citasPendientes as $cita) {
            $usuario = User::find($cita->usuario_id);

            if ($usuario) {
                // Enviar un correo notificando la cancelación de la cita
                Mail::to($usuario->email)->send(new CitaCanceladaPorTrabajador($usuario, $trabajador, $cita));

                // Si el método de pago fue "adelantado", reembolsar el precio al saldo del usuario
                if ($cita->metodo_pago === 'adelantado') {
                    $usuario->saldo += $cita->precio_cita ?? 0;
                    $usuario->save();
                }
            }


        }

        // Eliminar al trabajador
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

    public function citasBarberiaTrab(Request $request)
    {

        $usuario = Auth::user();

        // Verificar si el usuario es un trabajador
        if (!$usuario || $usuario->rol !== 'trabajador') {
            return response()->json(['error' => 'Acceso no autorizado'], 403);
        }

        // Obtener los filtros del request
        $servicioId = $request->input('servicio_id');
        $estado = $request->input('estado');
        $fechaDia = $request->input('fecha_dia');
        $fechaMes = $request->input('fecha_mes');


        $query = Cita::with(['usuario', 'barbero', 'servicio'])
            ->where('barbero_id', $usuario->id);

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

        return Inertia::render('Admin/MisDatosAdmin', [
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
            'imagen' => 'required|image|mimes:jpg,jpeg,png|max:2048', // Validar que sea una imagen
        ]);

        $trabajador = User::findOrFail($id); // Encuentra al trabajador por su ID

        // Elimina la foto anterior si existe y no es la predeterminada
        if ($trabajador->imagen && !str_contains($trabajador->imagen, 'default-avatar.png')) {
            Storage::disk('public')->delete($trabajador->imagen);
        }

        // Guarda la nueva foto en la misma carpeta que en `store()`
        $path = $request->file('imagen')->store('images', 'public');

        // Actualiza la imagen en la base de datos
        $trabajador->imagen = $path; // Solo la ruta relativa dentro de 'storage/app/public'
        $trabajador->save();

        return back()->with('success', 'Foto de perfil actualizada correctamente.');
    }






    public function guardarDiasDescanso(Request $request)
    {
        $dias = $request->input('dias');

        if (count($dias) > 0) {
            // Si solo hay un día seleccionado, lo guardamos directamente
            if (count($dias) == 1) {
                $fechaDescanso = Carbon::parse($dias[0])->addDay()->format('Y-m-d'); // Sumar 1 día al solo seleccionado

                // Verificar si ya existe el día de descanso
                $existeDescanso = Descanso::where('fecha', $fechaDescanso)->exists();

                if ($existeDescanso) {
                    return response()->json(['message' => 'Este día ya está registrado como descanso', 'dia' => $fechaDescanso], 400);
                }

                // Verificar si hay citas en ese día
                $existeCita = Cita::whereDate('fecha_hora_cita', $fechaDescanso)->exists();

                if ($existeCita) {
                    return response()->json(['message' => 'No se puede registrar este día como descanso porque ya existen citas programadas', 'dia' => $fechaDescanso], 400);
                }

                // Si no existe, guardamos el día de descanso
                Descanso::create([
                    'fecha' => $fechaDescanso,
                ]);
            } else {
                // Si hay un rango de días, ordenamos las fechas y las iteramos
                $fechaInicio = Carbon::parse($dias[0])->addDay();  // Sumamos 1 día al primer día del rango
                $fechaFin = Carbon::parse(end($dias));  // Último día del rango

                if ($fechaInicio->greaterThan($fechaFin)) {
                    return response()->json(['message' => 'La fecha de inicio no puede ser mayor que la de fin'], 400);
                }

                while ($fechaInicio->lte($fechaFin)) {
                    $fechaDescanso = $fechaInicio->format('Y-m-d');

                    // Verificar si ya existe el día de descanso
                    $existeDescanso = Descanso::where('fecha', $fechaDescanso)->exists();

                    if ($existeDescanso) {
                        return response()->json(['message' => 'Este día ya está registrado como descanso', 'dia' => $fechaDescanso], 400);
                    }

                    // Verificar si hay citas en ese día
                    $existeCita = Cita::whereDate('fecha_hora_cita', $fechaDescanso)->exists();

                    if ($existeCita) {
                        return response()->json(['message' => "No se puede registrar el descanso porque ya existen citas programadas el día $fechaDescanso", 'dia' => $fechaDescanso], 400);
                    }

                    // Si no existe, guardamos el día de descanso
                    Descanso::create([
                        'fecha' => $fechaDescanso,
                    ]);

                    // Avanzamos al siguiente día
                    $fechaInicio->addDay();  // Sumamos 1 día a cada día dentro del rango
                }

                $fechaDescanso = $fechaFin->format('Y-m-d');
                $existeDescanso = Descanso::where('fecha', $fechaDescanso)->exists();

                if (!$existeDescanso) {
                    Descanso::create([
                        'fecha' => $fechaDescanso,
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Días guardados correctamente'], 200);
    }


    public function guardarDescansoIndividual(Request $request)
    {
        $userId = $request->input('user_id');
        $dias = $request->input('dias');

        if (!$userId) {
            return response()->json(['message' => 'El ID del usuario es requerido.'], 400);
        }

        if (count($dias) == 0) {
            return response()->json(['message' => 'Por favor, selecciona al menos un día de descanso'], 400);
        }

        // Comprobamos si solo hay un día o un rango de días
        if (count($dias) == 1) {
            // Si solo hay un día seleccionado, verificamos y guardamos
            $fechaDescanso = Carbon::parse($dias[0])->addDay()->format('Y-m-d'); // Sumar 1 día al día seleccionado

            // Verificar si hay citas en ese día
            $citaExistente = Cita::where('barbero_id', $userId)
                ->whereDate('fecha_hora_cita', $fechaDescanso)
                ->exists();

            if ($citaExistente) {
                return response()->json(['message' => 'No se puede registrar el descanso porque ya hay citas ese día. Cancela las citas primero.'], 400);
            }

            // Verificar si ya existe el día para este usuario
            $existe = DescansoIndividual::where('user_id', $userId)
                ->where('fecha', $fechaDescanso)
                ->exists();

            if ($existe) {
                return response()->json(['message' => 'Este día ya está registrado como descanso para este usuario', 'fecha' => $fechaDescanso], 400);
            }

            // Si no hay citas y no existe el descanso, lo guardamos
            DescansoIndividual::create([
                'user_id' => $userId,
                'fecha' => $fechaDescanso,
            ]);
        } else {
            // Si hay un rango de días, verificamos y guardamos cada día
            $fechaInicio = Carbon::parse($dias[0])->addDay();  // Sumamos 1 día al primer día del rango
            $fechaFin = Carbon::parse(end($dias));  // Último día del rango

            if ($fechaInicio->greaterThan($fechaFin)) {
                return response()->json(['message' => 'La fecha de inicio no puede ser mayor que la de fin'], 400);
            }

            while ($fechaInicio->lte($fechaFin)) {
                $fechaDescanso = $fechaInicio->format('Y-m-d');

                // Verificar si hay citas en ese día
                $citaExistente = Cita::where('barbero_id', $userId)
                    ->whereDate('fecha_hora_cita', $fechaDescanso)
                    ->exists();

                if ($citaExistente) {
                    return response()->json(['message' => "No se puede registrar el descanso porque ya hay citas el día $fechaDescanso. Cancela las citas primero."], 400);
                }

                // Verificar si ya existe el descanso para este usuario
                $existe = DescansoIndividual::where('user_id', $userId)
                    ->where('fecha', $fechaDescanso)
                    ->exists();

                if (!$existe) {
                    // Si no existe el descanso, lo guardamos
                    DescansoIndividual::create([
                        'user_id' => $userId,
                        'fecha' => $fechaDescanso,
                    ]);
                }

                // Avanzamos al siguiente día
                $fechaInicio->addDay();
            }
        }

        return response()->json(['message' => 'Días de descanso guardados correctamente para el usuario'], 200);
    }
}
