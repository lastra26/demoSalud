<?php

namespace App\Models;

use App\Traits\ModelEventLogger;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

use Carbon\Carbon;

use Illuminate\Foundation\Auth\User as Authenticatable;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use App\Models\Catalogos\Unidad;

class User extends Authenticatable implements JWTSubject{
    use Notifiable;
    use SoftDeletes;
    protected $keyType = 'string';

    use ModelEventLogger;
    protected static $recordEvents = [
        'created',
        'updated',
        'deleted'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'password', 'name', 'email', 'avatar', 'status', 'colaborador_id', 'action_token', 'token_expires_at'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'action_token', 'token_expires_at'
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims(){
        return [
            'username' => $this->username,
            'name' => $this->name,
            'email' => $this->email,
        ];
    }

    /**********************************************************  Begin: Relationships Functions  **********************************************************/
    public function roles(){
        return $this->belongsToMany('App\Models\Role');
    }

    public function permissions(){
        return $this->belongsToMany('App\Models\Permission')->withPivot('status');
    }
    public function colaborador(){
        return $this->belongsTo('App\Models\Modulos\Colaborador', 'colaborador_id');
    }
    /**********************************************************  End: Relationships Functions  **********************************************************/

    //Funciones para creación de token para envio de correo
    public function createActionToken(){
        $count = 0;
        $token = '';

        do{
            $token = Str::random(100);
            $count++;
            $token_found = User::where('action_token',$token)->count();
            if($count > 5){
                break;
            }
        }while($token_found > 0); //Checa si la cadena esta repetida
        
        if(!$token){
            return false;
        }

        $today = date("Y-m-d H:i:s");//Carbon::now();
        $expires = date("Y-m-d H:i:s",strtotime($today." +1 day"));//Expira mañana

        $this->update(['action_token'=>$token,'token_expires_at'=>$expires]);
        
        return $this->action_token;
    }

    //Funciones para validación y obtención de permisos del usuario.
    //Aplica sobre un objeto usuario
    public function hasPermission($permission){
        $permissions = User::getPermissionsListForUser($this);
        if(isset($permissions[$permission])){
            return true;
        }else{
            return false;
        }
    }

    public function getPermissionsList(){
        $permissions = User::getPermissionsListForUser($this);
        return $permissions;
    }

    //Aplica desde la clase, y usa un objeto usuario como parametro
    static function getPermissionsListForUser($user){
        $permissions = [];

        if($user->is_superuser){
            $permissions_raw = Permission::get();
            foreach ($permissions_raw as $permission) {
                $permissions[$permission->id] = true;
            }
        }else{
            $user->load('roles.permissions','permissions');

            foreach ($user->roles as $rol) {
                foreach ($rol->permissions as $permission) {
                    if(!isset($permissions[$permission->id])){
                        $permissions[$permission->id] = true;
                    }
                }
            }

            foreach ($user->permissions as $permission) {
                if(!isset($permissions[$permission->id])){
                    $permissions[$permission->id] = true;
                }elseif(!$permission->pivot->status){
                    unset($permissions[$permission->id]);
                }
            }
        }

        return $permissions;
    }
}
