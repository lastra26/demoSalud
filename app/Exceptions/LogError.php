<?php

namespace App\Exceptions;
 
use Exception;
use Illuminate\Support\Facades\Auth;
use App\Models\SysLogErrors;
use Illuminate\Http\Response as HttpResponse;

class LogError extends Exception
{
    /**
     * Report the exception.
     *
     * @return void
     */
    public function report(){
    }
 
    /**
     * Render the exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    //public function render($request, Exception $exception){
    public function render($request, Exception $exception){
      $message = $exception->getMessage();

      $exception = $exception->getPrevious();

      $loggedUser = auth()->userOrFail();
      $array_exception = [
        'logged_user_id'    => ($loggedUser)?$loggedUser->id:null,
        'ip'                => $this->getIp(),
        'url'               => $request->url(),
        'method'            => $request->method(),
        'browser_info'      => $request->header('User-Agent'),
        'code'              => $exception->getCode(),
        'file'              => $exception->getFile(),
        'line'              => $exception->getLine(),
        'message'           => $exception->getMessage(),
        'trace'             => $exception->getTrace(),
        'parameters'        => $request->all(),
      ];

      $log = SysLogErrors::create($array_exception);

      if(!$message){
        $message = 'Ocurrio un error interno del servidor, por favor contacte con soporte técnico. ';
      }else{
        $last_chart = substr($message, -1);
        if($last_chart != '.'){
          $message .= '.';
        }
      }

      $return_data = ['message'=>$message.' Folio del error: '.str_pad($log->id,6,"0",STR_PAD_LEFT)];

      if($loggedUser->is_superuser){
        $return_data['exception'] = ['message'=>$exception->getMessage(), 'line'=>$exception->getLine()];
      }

      return response()->json($return_data, HttpResponse::HTTP_CONFLICT);
    }

    private function getIp(){
      foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
          if (array_key_exists($key, $_SERVER) === true){
              foreach (explode(',', $_SERVER[$key]) as $ip){
                  $ip = trim($ip); // just to be safe
                  if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
                      return $ip;
                  }
              }
          }
      }
      return request()->ip(); // it will return server ip when no client ip found
  }
}