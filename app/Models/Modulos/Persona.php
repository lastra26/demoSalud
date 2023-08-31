<?php

namespace App\Models\Modulos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Persona extends Model {
    use SoftDeletes;
    protected $table = 'personas';
    protected $primaryKey = 'sirh_id';
    protected $fillable = [
        'sirh_id',
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'clues_id',
        'cr_id',
    ];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function clues(){
        return $this->belongsTo('App\Models\Catalogos\Clue','clues_id');
    }

    public function cr(){
        return $this->belongsTo('App\Models\Catalogos\Cr','cr_id');
    }

    public function equipos(){
        return $this->belongsToMany('App\Models\Modulos\EquipoInventario', 'rel_equipo_persona', 'persona_id', 'equipo_id');
    }

}
