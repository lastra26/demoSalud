<?php

namespace App\Http\Controllers\API\Modulos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use App\Models\Modulos\RelSeguimientoColaborador;

class AsignarTicketController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $loggedUser = auth()->userOrFail();

        try {

            $parametros = $request->all();
            
            $seguimiento_colaborador = RelSeguimientoColaborador::select('rel_seguimiento_colaboradores.*')
            ->leftJoin("seguimientos_ticket as seguimientos", "rel_seguimiento_colaboradores.seguimiento_id", "=", "seguimientos.id")
            ->leftJoin("tickets as tickets", "seguimientos.ticket_id", "=", "tickets.id")
            ->where("rel_seguimiento_colaboradores.colaborador_id", "=", $loggedUser->colaborador_id)
            ->where("rel_seguimiento_colaboradores.status_seguimiento_id", "=", 2)
            ->with(['colaborador','status_seguimiento','seguimiento'=>function($seguimiento){
                $seguimiento->with('tipo_problema', 'tipo_equipo', 'area_atencion', 'status_seguimiento', 'ticket.persona', 'ticket.cr', 'ticket.clues', 'ticket.status_ticket');
            }])
            ->orderBy("rel_seguimiento_colaboradores.status_seguimiento_id");



            if((isset($parametros['sort']) && $parametros['sort']) && (isset($parametros['direction']) && $parametros['direction'])){
                $seguimiento_colaborador = $seguimiento_colaborador->orderBy($parametros['sort'],$parametros['direction']);
            }else{
                $seguimiento_colaborador = $seguimiento_colaborador->orderBy('updated_at','desc');
            }


            if(isset($parametros['page'])){

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $seguimiento_colaborador = $seguimiento_colaborador->paginate($resultadosPorPagina);
            } else {
                $seguimiento_colaborador = $seguimiento_colaborador->get();
            }

            return response()->json(['data' => $seguimiento_colaborador],HttpResponse::HTTP_OK);



        } catch (\Throwable $th) {
            return response()->json(['error'=>['message'=>$th->getMessage(),'line'=>$th->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
        $datos = $request->all();
        $hoy = new \DateTime();
        $reglas = [];
        $colaboradores = [];

        try {


            $v = Validator::make($datos, [
                'row.*.seguimiento_id'          => 'required',
                'row.*.colaborador_id'          => 'required',
                'row.*.status_seguimiento_id'   => 'required',
                'row.*.fecha_inicio'            => 'required',
                'row.*.fecha_fin'               => 'required',
                'row.*.observaciones'           => 'required',

            ]);
            
            if ($v->fails()) {
                return Response::json(array($v->errors(), 409));
            }


            foreach ($datos as $key => $value) {
                $colaboradores[] = [
                    'id'                    => $value['id'],
                    'seguimiento_id'        => $value['seguimiento_id'],
                    'colaborador_id'        => $value['colaborador_id'],
                    'status_seguimiento_id' => $value['status_seguimiento_id'],
                    'tiempo_transcurrido'   => $hoy->setTime(0, 0, 0),
                    'fecha_inicio'          => $value['fecha_inicio'],
                    'fecha_fin'             => $value['fecha_fin'],
                    'observaciones'         => $value['observaciones'],
                    'created_at'            => Carbon::now()
                ];
            }

            RelSeguimientoColaborador::insert($colaboradores);

            DB::commit();

            return response()->json(['ticket_asignado'=>$colaboradores],HttpResponse::HTTP_OK);

        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json(['error'=>['message'=>$th->getMessage(),'line'=>$th->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
