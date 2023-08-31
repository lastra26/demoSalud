<?php

namespace App\Models\Modulos;

use Illuminate\Database\Eloquent\Model;
//use Illuminate\Database\Eloquent\SoftDeletes;

class RelSeguimientoColaborador extends Model {
    //use SoftDeletes;
    protected $table = 'rel_seguimiento_colaboradores';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'seguimiento_id',
        'colaborador_id',
        'status_seguimiento_id',
        'tiempo_transcurrido',
        'fecha_inicio',
        'fecha_fin',
        'observaciones',
    ];

    public function seguimiento(){
        return $this->belongsTo('App\Models\Modulos\SeguimientoTicket','seguimiento_id', 'id');
    }

    public function colaborador(){
        return $this->belongsTo('App\Models\Modulos\Colaborador','colaborador_id', 'id');
    }

    public function status_seguimiento(){
        return $this->belongsTo('App\Models\Catalogos\StatusSeguimiento','status_seguimiento_id');
    }

}