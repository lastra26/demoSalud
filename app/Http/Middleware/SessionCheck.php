<?php

namespace App\Http\Middleware;

use Illuminate\Http\Response as HttpResponse;

use Closure;

class SessionCheck{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next){
        $current_payload = auth()->getPayload()->get('sesion');

        if(!$current_payload){
            return response()->json(['message' => 'No se encontraron los datos de sesión necesarios para completar la operación'], HttpResponse::HTTP_CONFLICT);
        }
        
        return $next($request);
    }
}
