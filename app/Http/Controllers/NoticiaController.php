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
        $noticias = Noticia::with('usuario')->get();

        return Inertia::render('ForoAdmin', [
            'noticias' => $noticias
        ]);
    }

    // Crear una nueva noticia
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
        ]);

        Noticia::create([
            'usuario_id' => auth()->id(),
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
        ]);

        return redirect()->route('admin-foro')->with('message', 'Noticia publicada con éxito.');
    }

    // Mostrar las noticias al cliente en la página de "Reservar Cita"
    public function showNoticias()
    {
        $noticias = Noticia::with('usuario')->get();

        return Inertia::render('ReservarCitaCliente', [
            'noticias' => $noticias,
        ]);
    }

    // Eliminar una noticia
    public function destroy(Noticia $noticia)
    {
        $noticia->delete();
        return redirect()->route('admin-foro')->with('message', 'Noticia eliminada con éxito.');
    }

    // Editar noticia
    public function edit(Noticia $noticia)
    {
        return Inertia::render('EditarNoticia', [
            'noticia' => $noticia,
        ]);
    }

    // Actualizar noticia
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
}
