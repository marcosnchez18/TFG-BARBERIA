<?php

namespace App\Http\Controllers;

use App\Models\Noticia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoticiaController extends Controller
{
    // Mostrar las noticias en el foro del admin
    public function index()
    {
        // Obtener todas las noticias junto con la información del usuario que las publicó
        $noticias = Noticia::with('usuario')->get();

        return Inertia::render('Admin/ForoAdmin', [
            'noticias' => $noticias
        ]);
    }

    public function indexTrab()
    {

        $noticias = Noticia::with('usuario')->get();

        return Inertia::render('Trabajador/ForoAdminTrabajador', [
            'noticias' => $noticias
        ]);
    }

    // Crear una nueva noticia
    public function store(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
        ]);

        // Crear la noticia en la base de datos
        Noticia::create([
            'usuario_id' => auth()->id(),
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
        ]);

        // Redirigir al foro con un mensaje de éxito
        return redirect()->route('admin-foro')->with('message', 'Noticia publicada con éxito.');
    }


    public function storeTrab(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
        ]);

        // Crear la noticia en la base de datos
        Noticia::create([
            'usuario_id' => auth()->id(),
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
        ]);

        // Redirigir al foro con un mensaje de éxito
        return redirect()->route('trabajador-foro')->with('message', 'Noticia publicada con éxito.');
    }

    // Mostrar las noticias al cliente en la página de "Reservar Cita"
    public function showNoticias()
    {
        // Obtener todas las noticias para los clientes
        $noticias = Noticia::with('usuario')->get();

        return Inertia::render('Cliente/ReservarCitaCliente', [
            'noticias' => $noticias,
        ]);
    }

    // Editar una noticia
    public function edit(Noticia $noticia)
    {

        return Inertia::render('Admin/EditarNoticia', [
            'noticia' => $noticia
        ]);
    }

    // Actualizar una noticia
    public function update(Request $request, Noticia $noticia)
    {

        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
        ]);


        $noticia->update([
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
        ]);


        return redirect()->route('admin-foro')->with('message', 'Noticia actualizada con éxito.');
    }

    public function updateTrab(Request $request, Noticia $noticia)
    {

        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
        ]);


        $noticia->update([
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
        ]);


        return redirect()->route('trabajador-foro')->with('message', 'Noticia actualizada con éxito.');
    }

    public function destroy(Noticia $noticia)
{

    $noticia->delete();


    return redirect()->route('admin-foro')->with('message', 'Noticia eliminada con éxito.');
}

public function destroyTrab(Noticia $noticia)
{

    $noticia->delete();


    return redirect()->route('trabajador-foro')->with('message', 'Noticia eliminada con éxito.');
}

}
