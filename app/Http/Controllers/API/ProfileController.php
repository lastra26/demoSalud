<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Hash;

use Validator;

use App\Http\Controllers\Controller;
use App\Models\User;

use DB;

class ProfileController extends Controller{

    public function getProfile(Request $request){
        try{
            $loggedUser = auth()->userOrFail();
            $user = User::select('id','username','avatar','name','email','created_at')->find($loggedUser->id);

            if(!$user){
                return response()->json(['message'=>'No fue posible recuperar los datos del usuario.'],HttpResponse::HTTP_CONFLICT);
            }

            return response()->json(['data'=>$user],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener los datos del perfil',null,$e);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateProfile(Request $request, $id){
        try{
            $validation_rules = [
                'name' => 'required',
                'email' => 'required',
                'avatar' => 'required',
            ];
        
            $validation_eror_messages = [
                'name.required' => 'El nombre es obligatorio',
                'email.required' => 'Es correo electronico es obligatorio',
                'avatar.required' => 'Es necesario seleccionar un avatar',
            ];

            $usuario = User::find($id);
            $loggedUser = auth()->userOrFail();

            if($loggedUser->id != $usuario->id){
                return response()->json(['message'=>'Los datos del usuario no coinciden con el de la sesión iniciada.'],HttpResponse::HTTP_CONFLICT);
            }

            $parametros = $request->all();

            $resultado = Validator::make($parametros,$validation_rules,$validation_eror_messages);

            if($resultado->passes()){
                $test_user = User::where(function($subWhere)use($parametros){
                    $subWhere->where('email',$parametros['email']);
                })->where('id','!=',$usuario->id)->get();

                if($test_user){
                    $response_validator = [];
                    foreach ($test_user as $user) {
                        if($user->email == $parametros['email']){
                            $response_validator['email'] = 'duplicated';
                        }
                    }

                    if(count($response_validator) > 0){
                        return response()->json(['message' => 'Algunos datos del formulario se encuentran duplicados','error_type'=>'form_validation','data'=>$response_validator], HttpResponse::HTTP_CONFLICT);
                    }
                }

                DB::beginTransaction();

                if($usuario->email != $parametros['email']){
                    $usuario->email_verified_at = null;
                }

                $usuario->name      = $parametros['name'];
                $usuario->email     = $parametros['email'];
                $usuario->avatar    = $parametros['avatar'];
                
                if(isset($parametros['password']) && $parametros['password']){
                    $validHash = Hash::check($parametros['old_password'],$usuario->password);
                    if(!$validHash){
                        DB::rollback();
                        return response()->json(['message' => 'La contraseña actual es incorrecta','error_type'=>'form_validation','data'=>['old_password'=>'wrongpassword']], HttpResponse::HTTP_CONFLICT);
                    }

                    $validHash = Hash::check($parametros['password'],$usuario->password);
                    if($validHash){
                        DB::rollback();
                        return response()->json(['message' => 'La nueva contraseña no puede ser igual a la anterior','error_type'=>'form_validation','data'=>['password'=>'samepassword']], HttpResponse::HTTP_CONFLICT);
                    }
                    $usuario->password = Hash::make($parametros['password']);
                }

                $usuario->save();

                DB::commit();

                return response()->json(['data'=>$usuario],HttpResponse::HTTP_OK);
            }else{
                return response()->json(['message' => 'Error en los datos del formulario', 'form_errors'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }
        }catch(\Exception $e){
            DB::rollback();
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar guardar los datos de perfil',null,$e);
        }
    }
}
