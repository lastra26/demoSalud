<?php

namespace App\Http\Controllers\API\Busquedas;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use App\Models\Modulos\Colaborador;


class BusquedaRecursosController extends Controller
{
    public function getColaboradorAutocomplete(Request $request) {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = $request->all();
            $colaborador = Colaborador::select('id', 'rfc', 'nombre_completo', 'hora_entrada', 'hora_salida');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $colaborador = $colaborador->where(function($query)use($parametros){
                    return $query->where('nombre_completo','LIKE','%'.$parametros['query'].'%');
                                //->orWhere('id','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $colaborador = $colaborador->paginate($resultadosPorPagina);
            } else {

                $colaborador = $colaborador->get();
            }

            return response()->json(['data'=>$colaborador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
