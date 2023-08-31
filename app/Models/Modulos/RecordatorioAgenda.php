<?php

namespace App\Models\Modulos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecordatorioAgenda extends Model {
    use SoftDeletes;
    protected $table = 'recordatorio_agenda';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'colaborador_id',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'asunto',
    ];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function colaborador(){
        return $this->belongsTo('App\Models\Modulos\Colaborador','colaborador_id');
    }

}