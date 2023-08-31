<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
//use Illuminate\Database\Eloquent\SoftDeletes;

class Cr extends Model {
    //use SoftDeletes;
    //protected $fillable = ['name'];
    protected $table = 'catalogo_cr';
    protected $primaryKey = 'cr';
    public $incrementing = false;
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

}
