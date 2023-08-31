<?php

namespace App\Models\Modulos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelTicket extends Model {
    use SoftDeletes;
    protected $table = 'rel_tickets';
    protected $primaryKey = 'id';
    protected $fillable = [
        'padre_id',
        'hijo_id'
    ];

    public function padre(){
        return $this->belongsTo('App\Models\Modulos\Ticket','padre_id', 'id');
    }

    public function hijo(){
        return $this->belongsTo('App\Models\Modulos\Ticket','hijo_id', 'id');
    }

}