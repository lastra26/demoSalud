<?php

namespace App\Models\Modulos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model {
    use SoftDeletes;
    protected $table = 'tickets';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'fecha_ticket',
        'nombre_persona',
        'persona_id',
        'status_ticket_id',
        'clues_id',
        'cr_id',
        'user_id'
    ];
    //protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function clues(){
        return $this->belongsTo('App\Models\Catalogos\Clue', 'clues_id');
    }

    public function cr(){
        return $this->belongsTo('App\Models\Catalogos\Cr', 'cr_id');
    }

    public function persona(){
        return $this->belongsTo('App\Models\Modulos\Persona','persona_id');
    }

    public function status_ticket(){
        return $this->belongsTo('App\Models\Catalogos\StatusTicket','status_ticket_id');
    }

    public function user(){
        return $this->belongsTo('App\Models\User','user_id');
    }

    public function seguimientos(){
        return $this->hasMany('App\Models\Modulos\SeguimientoTicket', 'ticket_id', 'id');
    }

}
