<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AreasAtencion extends Model {
    use SoftDeletes;
    protected $fillable = ['id','clave','descripcion'];
    protected $table = 'catalogo_distritos';
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

}