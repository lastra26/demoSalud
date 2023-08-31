<?php
namespace App\Models;

use App\Casts\Json;
use Illuminate\Database\Eloquent\Model;

class SysLogErrors extends Model{
    public $timestamps = false;
    protected $table = 'sys_log_errors';
    protected $fillable = [ 'created_at','logged_user_id','ip','url','method','browser_info','code','file','line','message','trace','parameters' ];
    
    protected $casts = [
        'parameters'    => Json::class,
        'trace'         => Json::class,
    ];

    public function usuario(){
        return $this->belongsTo('App\Models\User','logged_user_id');
    }
}