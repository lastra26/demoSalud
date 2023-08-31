<?php

namespace App\Http\Controllers\API\Modulos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use \Response, \DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

use App\Models\Modulos\Ticket;
use App\Models\Modulos\SeguimientoTicket;
use App\Models\User;

class TicketsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request){

        $loggedUser = auth()->userOrFail();

        try {

            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);

            $parametros = $request->all();
            $tickets = Ticket::select('tickets.*', 'seguimiento.id as seguimiento_id')
                             ->with('clues','cr','persona','status_ticket','user','seguimientos')
                             ->join("seguimientos_ticket as seguimiento", "tickets.id", "=", "seguimiento.ticket_id");



            foreach ($permisos->roles as $key => $value) {
                foreach ($value->permissions as $key2 => $val_permiso) {
                    if($val_permiso->id == 'keOt4BoasYwXAY7RXbzWfKldEZ1YpnZ8'){

                        $tickets = Ticket::select('tickets.*', 'seguimiento.id as seguimiento_id')->with('clues','cr','persona','status_ticket','user','seguimientos')
                        ->join("seguimientos_ticket as seguimiento", "tickets.id", "=", "seguimiento.ticket_id")
                        ->leftJoin("catalogo_areas_atencion as areas", "areas.id", "=", "seguimiento.area_atencion_id")
                        ->leftJoin("colaboradores_informatica as colaboradores", "colaboradores.area_atencion_id", "=", "areas.id")
                        ->leftJoin("catalogo_cargos as cargos", "cargos.id", "=", "colaboradores.cargo_id")
                        ->where("colaboradores.cargo_id", "=", 1)
                        ->where("tickets.status_ticket_id", "=", 1);

                    }else{
                        $tickets = Ticket::select('tickets.*', )->with('clues','cr','persona','status_ticket','user','seguimientos')
                        ->where("tickets.status_ticket_id", "=", 1);
                    }
                }
            }


            if((isset($parametros['sort']) && $parametros['sort']) && (isset($parametros['direction']) && $parametros['direction'])){
                $tickets = $tickets->orderBy($parametros['sort'],$parametros['direction']);
            }else{
                $tickets = $tickets->orderBy('updated_at','desc');
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $tickets = $tickets->paginate($resultadosPorPagina);
            } else {
                $tickets = $tickets->get();
            }

            return response()->json(['data'=>$tickets],HttpResponse::HTTP_OK);

        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['error'=>['message'=>$th->getMessage(),'line'=>$th->getLine()]], HttpResponse::HTTP_CONFLICT);

        }


    

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

        $fecha = Carbon::parse($datos['ticket']['fecha_ticket']);
        $loggedUser = auth()->userOrFail();
        $datos['ticket']['user_id'] = $loggedUser->id;
        

        try {
            $mensajes = [
                'required'      => "required",
                'unique'        => "unique"
            ];

            $reglas = [
                'fecha_ticket'      => 'required',
                'status_ticket_id'  => 'required',
                'clues_id'          => 'required',
                'cr_id'             => 'required',
            ];

            $ticket = new Ticket();
            $ticket->fecha_ticket      =   $fecha;
            $ticket->nombre_persona    =   $datos['ticket']['nombre_persona'];
            $ticket->persona_id        =   $datos['ticket']['persona_id'];
            $ticket->status_ticket_id  =   $datos['ticket']['status_ticket_id'];
            $ticket->clues_id          =   $datos['ticket']['clues_id'];
            $ticket->cr_id             =   $datos['ticket']['cr_id'];
            $ticket->user_id           =   $datos['ticket']['user_id'];



            $v = Validator::make($datos['ticket'], $reglas, $mensajes);
            
            if ($v->fails()) {
                return Response::json(array($v->errors(), 409));
            }

            $ticket = Ticket::create($datos['ticket']);

            $seguimiento[] = [
                'ticket_id'                     => $ticket->id,
                'status_seguimiento_id'         => $datos['seguimiento']['status_seguimiento_id'],
                'area_atencion_id'              => $datos['seguimiento']['area_atencion_id'],
                'tipo_problema_id'              => $datos['seguimiento']['tipo_problema_id'],
                'tipo_equipo_id'                => $datos['seguimiento']['tipo_equipo_id'],
                'descripcion_problema'          => $datos['seguimiento']['descripcion_problema'],
                'observaciones_problema'        => $datos['seguimiento']['observaciones_problema']
            ];

            $ticket->seguimientos()->createMany($seguimiento);

            DB::commit();
            
            return response()->json(['ticket'=>$ticket, 'seguimiento'=>$seguimiento],HttpResponse::HTTP_OK);

        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json(['error'=>['message'=>$th->getMessage(),'line'=>$th->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id){

        $datos = $request->all();
        $fecha = Carbon::parse($datos['ticket']['fecha_ticket']);
        $loggedUser = auth()->userOrFail();
        $datos['ticket']['user_id'] = $loggedUser->id;


        

        try {
            $mensajes_ticket = [
                'required'      => "required",
                'unique'        => "unique"
            ];

            $reglas_ticket = [
                'fecha_ticket'      => 'required',
                'status_ticket_id'  => 'required',
                'clues_id'          => 'required',
                'cr_id'             => 'required',
            ];

            $ticket = Ticket::find($id);
            $ticket->fecha_ticket      =   $fecha;
            $ticket->nombre_persona    =   $datos['ticket']['nombre_persona'];
            $ticket->persona_id        =   $datos['ticket']['persona_id'];
            $ticket->status_ticket_id  =   $datos['ticket']['status_ticket_id'];
            $ticket->clues_id          =   $datos['ticket']['clues_id'];
            $ticket->cr_id             =   $datos['ticket']['cr_id'];
            $ticket->user_id           =   $datos['ticket']['user_id'];

            $validator_ticket = Validator::make($datos['ticket'], $reglas_ticket, $mensajes_ticket);
            
            if ($validator_ticket->fails()) {
                return Response::json(array($validator_ticket->errors(), 409));
            }
            
            $ticket->save();


            $mensajes_seguimiento = [
                'required'      => "required",
                'unique'        => "unique"
            ];

            $reglas_seguimiento = [

                'ticket_id'                 => 'required',
                'status_seguimiento_id'     => 'required',
                'area_atencion_id'          => 'required',
                'tipo_problema_id'          => 'required',
                'tipo_equipo_id'            => 'required',
                'descripcion_problema'      => 'required',
                'observaciones_problema'    => 'required',

            ];

            $seguimiento = SeguimientoTicket::find($datos['seguimiento']['id']);

            $seguimiento->ticket_id                     = $datos['seguimiento']['ticket_id'];
            $seguimiento->status_seguimiento_id         = $datos['seguimiento']['status_seguimiento_id'];
            $seguimiento->area_atencion_id              = $datos['seguimiento']['area_atencion_id'];
            $seguimiento->tipo_problema_id              = $datos['seguimiento']['tipo_problema_id'];
            $seguimiento->tipo_equipo_id                = $datos['seguimiento']['tipo_equipo_id'];
            $seguimiento->descripcion_problema          = $datos['seguimiento']['descripcion_problema'];
            $seguimiento->observaciones_problema        = $datos['seguimiento']['observaciones_problema'];

            $validator_seguimiento = Validator::make($datos['seguimiento'], $reglas_seguimiento, $mensajes_seguimiento);
            
            if ($validator_seguimiento->fails()) {
                return Response::json(array($validator_seguimiento->errors(), 409));
            }

            $seguimiento->save();
            
            return response()->json(['ticket'=>$ticket, 'seguimiento'=>$seguimiento],HttpResponse::HTTP_OK);

        } catch (\Throwable $th) {
            return response()->json(['error'=>['message'=>$th->getMessage(),'line'=>$th->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
        

        //$camas = Camas::find($id);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        $ticket = Ticket::with('clues', 'cr','persona','status_ticket','user','seguimientos')->find($id);

        if(!$ticket){
            return response()->json(['No se encuentra el Ticket que esta buscando!!'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['data' => $ticket], 200);
    }

    public function getFirstSeguimiento($id){

        $ticket_first_seg = SeguimientoTicket::select('seguimientos_ticket.*')
        ->with(['status_seguimiento', 'area_atencion', 'tipo_problema', 'tipo_equipo'])
        ->orderBy('id', 'ASC')->take(1)
        ->where('ticket_id', '=', $id)
        ->first();


        if(!$ticket_first_seg){
            return response()->json(['No se encuentra el Seguimiento que esta buscando!!'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['data' => $ticket_first_seg], 200);

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
