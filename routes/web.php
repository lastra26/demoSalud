<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    View::addExtension('html','php');
    return View::make('index');
});

Route::get('images/{filename}', function ($filename)
{
    $file = \Illuminate\Support\Facades\Storage::disk('public')->get($filename);
    return response($file, 200)->header('Content-Type', 'image/svg+xml');
});

//Usar esta ruta para diseñar el mensaje de correo a enviar, modificar dependiendo de lo que se necesite
/*Route::get('/mail/reset-password/html', function () {
    return view('mails.recover-password',['token'=>'token-generado-por-el-sistema','name'=>'Nombre del Usuario']);
});*/