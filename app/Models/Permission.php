<?php

namespace App\Models;

use App\Traits\ModelEventLogger;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends Model
{
    use SoftDeletes;
    //use ModelEventLogger;
    protected $fillable = [ 'id', 'description', 'group', 'is_super' ];
    public $incrementing = false;
    protected $keyType = 'string';

    // protected static $recordEvents = [
    //     'created',
    //     'updated',
    //     'deleted'
    // ];
}
