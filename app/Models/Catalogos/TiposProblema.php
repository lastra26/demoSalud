<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TiposProblema extends Model {
    use SoftDeletes;
    protected $fillable = ['id', 'descripcion', 'area_atencion_id'];
    protected $table = 'catalogo_tipos_problemas';
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function area_atencion(){
        return $this->belongsTo('App\Models\Catalogos\AreasAtencion','area_atencion_id');
    }

}