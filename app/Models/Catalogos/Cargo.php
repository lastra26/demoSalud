<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cargo extends Model {
    use SoftDeletes;
    protected $fillable = ['id', 'descripcion'];
    protected $table = 'catalogo_cargos';
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

}