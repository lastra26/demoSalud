<?php

namespace App\Models;

use App\Casts\Json;
use Illuminate\Database\Eloquent\Model;
//use Illuminate\Database\Eloquent\SoftDeletes;

class ActivityLogs extends Model
{
    //use SoftDeletes;
    protected $table = 'activity_logs';
    protected $fillable = [
        'id',
        'fecha_hora',
        'usuario_id',
        'registro_id',
        'path_modelo',
        'accion',
        'descripcion',
        'detalles_registro'
    ];

    protected $casts = [
        'registro'         => Json::class,
    ];

    public function usuario(){
        return $this->belongsTo('App\Models\User','usuario_id');
    }
}
