<?php

use App\Http\Controllers\API\Catalogos\CatalogoController;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('logout',           'API\Auth\AuthController@logout');
    Route::get('perfil',            'API\Auth\AuthController@me');
});

Route::post('signin',               'API\Auth\AuthController@login');
Route::post('refresh',              'API\Auth\AuthController@refresh');
Route::post('reset-password',       'API\Auth\AuthController@resetPassword');
Route::post('send-reset-password',  'API\Auth\AuthController@sendResetPassword');

/**
 *  Para envio de correos
 */
Route::get('enviar-recuperar-pass',             'API\Admin\MailerController@enviarRecuperarContrasena');

Route::group(['middleware'=>'auth'],function($router){
    //Route::post('change-session',           'API\Auth\AuthController@updateToken');

    Route::get('perfil-usuario',            'API\ProfileController@getProfile');
    Route::put('perfil-usuario/{id}',       'API\ProfileController@updateProfile');
    
    //DevTools dev-tools/sys-log-errors
    Route::apiResource('dev-tools/sys-log-errors',    'API\DevTools\SysLogErrorsController')->only([ 'index', 'show']);
    Route::get('dev-tools/ejecutar-query',            'API\DevTools\DevReporterController@executeQuery');
    Route::get('dev-tools/exportar-query',            'API\DevTools\DevReporterController@exportExcel');

    Route::apiResource('user',                      'API\Admin\UserController');
    Route::get('user-catalogs',                     'API\Admin\UserController@getCatalogs');
    Route::put('change-user-status/{id}',           'API\Admin\UserController@changeUserStatus');

    Route::apiResource('permission',    'API\Admin\PermissionController');
    Route::apiResource('role',          'API\Admin\RoleController');

    //tickets
    Route::apiResource('tickets',     'API\Modulos\TicketsController');
    Route::get('ticket-seguimiento/{id}',  'API\Modulos\TicketsController@getFirstSeguimiento');
    Route::post('catalogs',    'API\Busquedas\BusquedaCatalogosController@getCatalogs');

    Route::apiResource('seguimiento-colaboradores',     'API\Modulos\AsignarTicketController');
    
    //busquedas
    Route::get('busqueda-colaborador',      'API\Busquedas\BusquedaRecursosController@getColaboradorAutocomplete');

    Route::apiResource('usuariomon', CatalogoController::class);
});




Route::middleware('auth')->get('/avatar-images', function (Request $request) {
    $avatars_path = public_path() . config('ng-client.path') . '/assets/avatars';
    $image_files = glob( $avatars_path . '/*', GLOB_MARK );

    $root_path = public_path() . config('ng-client.path');

    $clean_path = function($value)use($root_path) {
        return str_replace($root_path,'',$value);
    };
    
    $avatars = array_map($clean_path, $image_files);

    return response()->json(['images'=>$avatars], HttpResponse::HTTP_OK);
});