<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TiposEquipo extends Model {
    use SoftDeletes;
    protected $fillable = ['id', 'descripcion'];
    protected $table = 'catalogo_tipos_equipo';
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

}