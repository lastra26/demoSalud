<?php

namespace App\Models\Modulos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentoCompartido extends Model {
    use SoftDeletes;
    protected $table = 'documentos_compartidos';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'colaborador_id',
        'tipo',
        'url',
    ];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function colaborador(){
        return $this->belongsTo('App\Models\Modulos\Colaborador','colaborador_id');
    }

}