<?php

namespace App\Models\Modulos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelEquipoPersona extends Model {
    use SoftDeletes;
    protected $table = 'rel_equipo_persona';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'equipo_id',
        'persona_id'
    ];

    public function equipo(){
        return $this->belongsTo('App\Models\Modulos\EquipoInventario','equipo_id', 'id');
    }

    public function persona(){
        return $this->belongsTo('App\Models\Modulos\Persona','persona_id', 'sirh_id')->with('equipos');
    }

}