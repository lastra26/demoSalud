<?php

namespace App\Http\Controllers\API\Auth;

use JWTAuth;

use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPassword;

use Carbon\Carbon;

use App\Models\User;
use App\Models\Permission;
use App\Models\Catalogos\Unidad;
use App\Models\Catalogos\Distrito;

class AuthController extends Controller{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct(){
        $this->middleware('auth:api', ['except' => ['login','refresh','resetPassword','sendResetPassword']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
        try{
            $credentials = request(['username', 'password']);
            $user = User::where('username',$credentials['username'])->first();

            if(!$user){
                return response()->json(['message' => 'Nombre de usuario no encontrado'], HttpResponse::HTTP_CONFLICT);
            }

            if($user->status > 2){
                if($user->status == 3){
                    return response()->json(['message' => 'El usuario ha sido bloqueado por 5 intentos fallidos de inicio de sesión','status'=>3], HttpResponse::HTTP_CONFLICT);
                }else if($user->status == 4){
                    return response()->json(['message' => 'El usuario ha sido baneado del sistema','status'=>4], HttpResponse::HTTP_CONFLICT);
                }else{
                    return response()->json(['message' => 'Estatus del usuario desconocido'], HttpResponse::HTTP_CONFLICT);
                }
            }else if($user->status == 1){
                return response()->json(['message' => 'Usuario inactivo, para activar el usuario es necesario cambiar la contraseña','status'=>'activate_user','usuario'=>$user], HttpResponse::HTTP_OK);
            }

            $user->timestamps = false;
            //if (! $token = auth()->attempt($credentials)) {
            $validHash = Hash::check($credentials['password'],$user->password);
            if (!$validHash) {
                $user->last_attempt_at = date("Y-m-d H:i:s", strtotime('now'));
                $user->failed_attempts += 1;
                if($user->failed_attempts == 5){
                    $user->status = 3;
                }
                $user->save();

                return response()->json(['message' => 'Contraseña incorrecta'], HttpResponse::HTTP_CONFLICT);
            }

            $token = JWTAuth::customClaims([])->fromUser($user);

            $user->last_login_at = date("Y-m-d H:i:s", strtotime('now'));
            $user->failed_attempts = 0;
            $user->save();
            
            return $this->respondWithToken($token, $user);
        }catch(\Exception $e){
            return response()->json(['message' => 'Error al intentar iniciar la sesión'], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function resetPassword(Request $request){
        try{
            
            $params = $request->all();
            $activation_token = false;

            if(isset($params['activation_token']) && $params['activation_token']){
                $activation_token = true;
                //Buscar el usuario con el token de activacion
                $user = User::where('action_token',$params['activation_token'])->first();
                $today = Carbon::now();
                if($user){
                    if($today->gt($user->token_expires_at)){
                        return response()->json(['message' => 'El token para esta acción ha expirado.'], HttpResponse::HTTP_CONFLICT);
                    }
                    $user->action_token = null;
                    $user->token_expires_at = null;
                }else{
                    return response()->json(['message' => 'El token para esta acción no es valido'], HttpResponse::HTTP_CONFLICT);
                }
            }else{
                $user = User::where('id',$params['id'])->where('username',$params['username'])->first();

                if(!$user){
                    return response()->json(['message' => 'Usuario no encontrado'], HttpResponse::HTTP_CONFLICT);
                }
            }

            if($user->status == 3 || $user->status == 4){
                if($user->status == 3){
                    return response()->json(['message' => 'El usuario ha sido bloqueado por 5 intentos fallidos de inicio de sesión','status'=>3], HttpResponse::HTTP_CONFLICT);
                }else if($user->status == 4){
                    return response()->json(['message' => 'El usuario ha sido baneado del sistema','status'=>4], HttpResponse::HTTP_CONFLICT);
                }
            }

            if(!$activation_token && isset($params['password'])){
                $validHash = Hash::check($params['password'],$user->password);
                if(!$validHash){
                    $user->last_attempt_at = date("Y-m-d H:i:s", strtotime('now'));
                    $user->failed_attempts += 1;
                    if($user->failed_attempts == 5){
                        $user->status = 3;
                    }
                    $user->save();
                    return response()->json(['message' => 'Contraseña incorrecta','error_type'=>'wrong_pass','field'=>'password'], HttpResponse::HTTP_CONFLICT);
                }
            }

            $validHash = Hash::check($params['new_password'],$user->password);
            if($validHash){
                return response()->json(['message' => 'La nueva contraseña no puede ser igual a la anterior'], HttpResponse::HTTP_CONFLICT);
            }
            
            $user->password = Hash::make($params['new_password']);
            $user->failed_attempts = 0;
            $user->status = 2;

            if(!$activation_token){
                $user->last_login_at = date("Y-m-d H:i:s", strtotime('now'));
                $user->save();

                $credentials = [
                    'username' => $user->username,
                    'password' => $params['new_password'],
                ];

                //$token = auth()->attempt($credentials);
                $token = JWTAuth::fromUser($user);
    
                if(!$token){
                    return response()->json(['message' => 'No se pudo generar el token de acceso'], HttpResponse::HTTP_CONFLICT);
                }
    
                return $this->respondWithToken($token, $user);
            }else{
                if(!$user->email_verified_at){
                    $user->email_verified_at = date("Y-m-d H:i:s", strtotime('now'));
                }
                $user->save();
                return response()->json(['message' => 'Contraseña establecida exitosamente'], HttpResponse::HTTP_OK);
            }
        }catch(\Exception $e){
            return response()->json(['message' => 'Error al intentar activar al usuario','exception'=>$e->getMessage(), 'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function sendResetPassword(Request $request){
        try{
            $params = $request->all();

            $user_email = $params['user_email'];

            $user = User::where('email',$user_email)->orWhere('username',$user_email)->first();
            
            if(!$user){
                return response()->json(['message' => 'Usuario no encontrado'], HttpResponse::HTTP_CONFLICT);
            }

            if($user->status == 4){
                return response()->json(['message' => 'El Usuario se encuentra baneado del sistema'], HttpResponse::HTTP_CONFLICT);
            }

            $token = $user->createActionToken();
            $email = $user->email;
            $subject = 'Restablecer Contraseña';
            Mail::to($email)->send(new ResetPassword($user, $token));

            if(count(Mail::failures()) > 0){
                return response()->json(['message' => 'Error al intentar enviar el correo'], HttpResponse::HTTP_CONFLICT);
            }

            $email = preg_replace_callback('/(\w)(.*?)(\w)(@.*?)$/s', function ($matches){
                        return $matches[1].preg_replace("/\w/", "*", $matches[2]).$matches[3].$matches[4];
                    }, $user->email);
            //
            return response()->json(['message' => 'Correo enviado con éxito', 'email'=>$email], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['message' => 'Error al intentar enviar el correo','ex'=>$e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(){
        try {
            return response()->json(auth()->userOrFail());
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
            return response()->json(['error' => 'Usuario no válido'], 401);
        }
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(){
        auth()->logout();

        return response()->json(['message' => 'Sesión cerrada con éxito'],200);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh(){
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Update customClaims of token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateToken(Request $request){
        try{
            $loggedUser = auth()->userOrFail();
            /*
            $params = $request->all();
            $customs = ['sesion'=>$params];
            $token = JWTAuth::customClaims($customs)->fromUser($loggedUser);
            */
            $token = JWTAuth::fromUser($loggedUser);
            return $this->respondWithToken($token);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Error al intentar actualizar el Token',null,$e);
        }
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token, $user = null){
        $response = [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 360
        ];

        if($user){
            $permisos = [];

            $permisos = $user->getPermissionsList();

            $response['status'] = 'OK';
            $response['user_data'] = $user;
            $response['permissions'] = $permisos;
        }

        return response()->json($response);
    }
}
