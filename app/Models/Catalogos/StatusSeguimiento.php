<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;

class StatusSeguimiento extends Model {
    protected $fillable = ['id', 'descripcion'];
    protected $table = 'status_seguimiento';

}