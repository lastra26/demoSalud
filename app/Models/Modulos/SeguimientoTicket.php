<?php

namespace App\Models\Modulos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SeguimientoTicket extends Model {
    use SoftDeletes;
    protected $table = 'seguimientos_ticket';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'ticket_id',
        'status_seguimiento_id',
        'area_atencion_id',
        'tipo_problema_id',
        'tipo_equipo_id',
        'descripcion_problema',
        'observaciones_problema',
    ];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function ticket(){
        return $this->belongsTo('App\Models\Modulos\Ticket','ticket_id');
    }

    public function status_seguimiento(){
        return $this->belongsTo('App\Models\Catalogos\StatusSeguimiento','status_seguimiento_id');
    }

    public function area_atencion(){
        return $this->belongsTo('App\Models\Catalogos\AreasAtencion','area_atencion_id');
    }

    public function tipo_problema(){
        return $this->belongsTo('App\Models\Catalogos\TiposProblema','tipo_problema_id');
    }

    public function tipo_equipo(){
        return $this->belongsTo('App\Models\Catalogos\TiposEquipo','tipo_equipo_id');
    }

    public function colaboradores(){
        return $this->belongsToMany('App\Models\Modulos\Colaborador', 'rel_seguimiento_colaboradores', 'seguimiento_id', 'colaborador_id');
    }

}











