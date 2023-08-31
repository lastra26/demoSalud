<?php

namespace App\Models\Modulos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EquipoInventario extends Model {
    use SoftDeletes;
    protected $table = 'equipos_inventario';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'marca',
        'modelo',
        'no_serie',
        'no_inventario',
        'equipo_personal',
        'tipo_equipo_id',
    ];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function tipo_equipo(){
        return $this->belongsTo('App\Models\Catalogos\TiposEquipo','tipo_equipo_id');
    }

}