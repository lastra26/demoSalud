<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
//use Illuminate\Database\Eloquent\SoftDeletes;

class Clue extends Model {
    //use SoftDeletes;
    //protected $fillable = ['name'];
    protected $table = 'catalogo_clues';
    protected $primaryKey = 'clues';
    public $incrementing = false;
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

}
