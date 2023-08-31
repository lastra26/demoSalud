<?php

namespace App\Http\Controllers\API\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use Validator;

use Illuminate\Support\Facades\Mail;
use App\Mail\EmailConfirmation;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Permission;
use App\Models\Role;

use DB;

class UserController extends Controller{

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct(){
        //$this->middleware('valid.session'); //Se agrego Middleware para checar datos guardados en el token
    }


    public function getCatalogs(Request $request){
        try{
            $loggedUser = auth()->userOrFail();
            $parametros = $request->all();
            $return_data = [];

            $return_data['roles'] = Role::with('permissions')->get();

            $permisos = Permission::getModel();
            if(!$loggedUser->is_superuser){
                $permisos = $permisos::where(DB::raw('IFNULL(is_super,0)'),0);
            }
            $return_data['permisos'] = $permisos->get();
            
            return response()->json(['data'=>$return_data],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al obtener los catalogos',null,$e);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $usuarios = User::getModel();

            if(!$loggedUser->is_superuser){
                $usuarios = $usuarios->where('is_superuser','0');
            }
            
            //Filtros, busquedas, ordenamiento
            if($parametros['query']){
                $usuarios = $usuarios->where(function($query)use($parametros){
                    return $query->where('name','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('username','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('email','LIKE','%'.$parametros['query'].'%');
                });
            }

            if((isset($parametros['sort']) && $parametros['sort']) && (isset($parametros['direction']) && $parametros['direction'])){
                $usuarios = $usuarios->orderBy($parametros['sort'],$parametros['direction']);
            }else{
                $usuarios = $usuarios->orderBy('updated_at','desc');
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $usuarios = $usuarios->paginate($resultadosPorPagina);
            } else {
                $usuarios = $usuarios->get();
            }

            return response()->json(['data'=>$usuarios],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios',null,$e);
        }
    }

    public function changeUserStatus(Request $request, $id){
        try{
            $parametros = $request->all();

            $user = User::find($id);

            if(!$user){
                return response()->json(['message' => 'El Usuario seleccionado no esta disponible o no fue encontrado'], HttpResponse::HTTP_CONFLICT);
            }

            if($user->status != $parametros['status']){
                if($parametros['status'] == 2 && !$user->last_login_at){
                    $parametros['status'] = 1;
                }
                $user->status = $parametros['status'];
                $user->save();
            }

            return response()->json(['message'=>'Usuario actualizado con éxito','status'=>$parametros['status']],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar guardar los datos del usuario',null,$e);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
        try{
            $validation_rules = [
                'name' => 'required',
                'email' => 'required',
                'username' => 'required',
            ];
        
            $validation_eror_messages = [
                'name.required' => 'El nombre es obligatorio',
                'email.required' => 'Es correo electronico es obligatorio',
                'username.required' => 'El nombre de usuario es obligatorio',
            ];

            $parametros = $request->all();

            $resultado = Validator::make($parametros,$validation_rules,$validation_eror_messages);

            if($resultado->passes()){
                DB::beginTransaction();

                $nuevo_user = false;

                $valid_user = User::where(function($subWhere)use($parametros){
                                    $subWhere->where('username',$parametros['username'])->orWhere('email',$parametros['email']);
                                });
                if($parametros['id']){
                    $valid_user->where('id','!=',$parametros['id']);
                }
                $valid_user = $valid_user->get();

                if($valid_user){
                    $response_validator = [];
                    foreach ($valid_user as $user) {
                        if($user->email == $parametros['email']){
                            $response_validator['email'] = 'duplicated';
                        }
                        
                        if($user->username == $parametros['username']){
                            $response_validator['username'] = 'duplicated';
                        }
                    }

                    if(count($response_validator) > 0){
                        DB::rollback();
                        return response()->json(['message' => 'Algunos datos del formulario se encuentran repetidos','error_type'=>'form_validation','data'=>$response_validator], HttpResponse::HTTP_CONFLICT);
                    }
                }

                $user_data = [
                    'name'              => $parametros['name'],
                    'email'             => $parametros['email'],
                    'username'          => $parametros['username'],
                    'colaborador_id'    => $parametros['colaborador_id'],
                    'avatar'            => $parametros['avatar'],
                ];

                if(isset($parametros['password'])){
                    $user_data['password'] = Hash::make($parametros['password']);
                }

                if($parametros['id']){
                    $usuario = User::find($parametros['id']);
                    if(!$usuario){
                        DB::rollback();
                        return response()->json(['message' => 'No se encontró el usuario seleccionado'], HttpResponse::HTTP_CONFLICT);
                    }

                    if(isset($parametros['password'])){
                        $validHash = Hash::check($parametros['password'],$usuario->password);
                        if($validHash){
                            DB::rollback();
                            return response()->json(['message' => 'La nueva contraseña no puede ser igual a la anterior','error_type'=>'form_validation','data'=>['password'=>'samepassword']], HttpResponse::HTTP_CONFLICT);
                        }
                    }
                    
                    if($usuario->status != $parametros['status']){
                        if($parametros['status'] == 2){
                            if(!$usuario->last_login_at){
                                $user_data['status'] = 1;
                            }else{
                                $user_data['status'] = 2;
                            }
                        }else{
                            $user_data['status'] = $parametros['status'];
                        }
                    }

                    $usuario->update($user_data);
                }else{
                    $user_data['status'] = 1;
                    if($parametros['mail_password']){
                        //$password_temp = Str::random(8);
                        //$user_data['password'] = Hash::make($password_temp);
                        $user_data['password'] = 'Enviado por correo electronico';
                        //Enviar correo de activación
                    }
                    $usuario = User::create($user_data);
                    $nuevo_user = true;
                }

                if(!$usuario->is_superuser){
                    $roles = $parametros['roles'];
                    $permisos = $parametros['permissions'];
                }else{
                    $roles = [];
                    $permisos = [];
                }

                $usuario->roles()->sync($roles);
                $usuario->permissions()->sync($permisos);

                $usuario->touch();

                DB::commit();

                $return_data = ['data'=>$usuario];

                if($nuevo_user && $parametros['mail_password']){
                    $token = $usuario->createActionToken();
                    Mail::to($usuario->email)->send(new EmailConfirmation($usuario,$token));
                    $return_data['mail_sent'] = (count(Mail::failures()) == 0)?1:0;
                }

                return response()->json($return_data,HttpResponse::HTTP_OK);
            }else{
                return response()->json(['message' => 'Error en los datos del formulario', 'error_type'=>'form_validation', 'data'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }
        }catch(\Exception $e){
            DB::rollback();
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar guardar los datos del usuario',null,$e);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        try{
            $usuario = User::with('roles','permissions', 'colaborador')->find($id);
            if(!$usuario){
                return response()->json(['mensaje' => 'No se encontró el usuario seleccionado'], HttpResponse::HTTP_CONFLICT);
            }
            return response()->json(['data'=>$usuario],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener los datos del usuario',null,$e);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id){
        try{
            $usuario = User::find($id);

            if(!$usuario){
                return response()->json(['mensaje' => 'No se encontró el usuario seleccionado'], HttpResponse::HTTP_CONFLICT);
            }

            $usuario->roles()->sync([]);
            $usuario->permissions()->sync([]);
            $usuario->delete();

            return response()->json(['eliminado'=>true],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
