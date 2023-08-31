<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;


class StatusTicket extends Model {
    
    protected $table = 'status_ticket';
    protected $primaryKey = 'id';
    protected $fillable = ['id', 'descripcion'];

}