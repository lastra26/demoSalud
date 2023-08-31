<?php

namespace App\Models\Modulos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Colaborador extends Model {
    use SoftDeletes;
    protected $table = 'colaboradores_informatica';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'cargo_id',
        'rfc',
        'nombre_completo',
        'area_atencion_id',
        'hora_entrada',
        'hora_salida',
    ];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function cargo(){
        return $this->belongsTo('App\Models\Catalogos\Cargo','cargo_id');
    }

    public function area_atencion(){
        return $this->belongsTo('App\Models\Catalogos\AreasAtencion','area_atencion_id');
    }

}
