<?php

namespace App\Http\Controllers\API\DevTools;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Requests;

use App\Models\SysLogErrors;

class SysLogErrorsController extends Controller{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request){
        try{
            $loggedUser = auth()->userOrFail();
            if(!$loggedUser->is_superuser){
                return response()->json(['message'=>'El usuario no tiene permiso para ver esta información'], HttpResponse::HTTP_CONFLICT);
            }

            $parametros = $request->all();
            
            $activity = SysLogErrors::with('usuario')->orderBy('created_at','desc');
            
            if(isset($parametros['fecha_inicio']) && $parametros['fecha_inicio']){
                $activity = $activity->whereDate('created_at','>=',$parametros['fecha_inicio'])
                                    ->whereDate('created_at','<=',$parametros['fecha_fin']);
            }

            if(isset($parametros['query']) && $parametros['query']){
                $search_query = $parametros['query'];
                $activity = $activity->where('id',$search_query);
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 23;
                $activity = $activity->paginate($resultadosPorPagina);
                
            } else {
                $activity = $activity->get();
            }

            return response()->json($activity, HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('',null,$e);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        try{
            $loggedUser = auth()->userOrFail();
            if(!$loggedUser->is_superuser){
                return response()->json(['error'=>'El usuario no tiene permiso para ver esta información'], HttpResponse::HTTP_CONFLICT);
            }

            $activity = SysLogErrors::with('usuario')->find($id);

            if(!$activity){
                return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            }

            return response()->json(['data' => $activity], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('',null,$e);
        }
    }
}