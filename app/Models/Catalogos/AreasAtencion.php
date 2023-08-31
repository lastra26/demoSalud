<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AreasAtencion extends Model {
    use SoftDeletes;
    protected $fillable = ['id', 'descripcion'];
    protected $table = 'catalogo_areas_atencion';
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

}