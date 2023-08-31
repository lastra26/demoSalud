<?php

namespace App\Http\Controllers\API\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Hash;

use Validator;

use App\Http\Controllers\Controller;

use App\Models\Role, App\Models\Permission;
use DB;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (\Gate::denies('has-permission', \Permissions::CRUD_ROLES)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }
        
        try{
            $parametros = $request->all();
            $usuario = auth()->userOrFail();
            

            $roles = Role::select('roles.*', DB::raw("COUNT(DISTINCT role_user.user_id) as total_users"), DB::raw("COUNT(DISTINCT permission_role.permission_id) as total_permissions"))
                            ->leftjoin('role_user','role_user.role_id','=','roles.id')
                            ->leftjoin('permission_role','permission_role.role_id','=','roles.id')
                            ->groupBy('roles.id');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $roles = $roles->where(function($query)use($parametros){
                    return $query->where('name','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $roles = $roles->orderBy('updated_at','DESC');
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $roles = $roles->paginate($resultadosPorPagina);
            } else {
                $roles = $roles->with('nivel','permissions')->orderBy('name')->get();
            }

            return response()->json(['data'=>$roles],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de roles',null,$e);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
        $this->authorize('has-permission',\Permissions::CRUD_ROLES);
        try{
            $validation_rules = [
                'name' => 'required',
                'permissions' => 'required|min:1'
            ];
        
            $validation_eror_messages = [
                'name.required' => 'El nombre es requerido',
                'permission.required' => 'Es requerido tener permisos asignados',
                'permission.min' => 'Se debe tener al menos un permiso asignado'
            ];

            $parametros = $request->all(); 
            
            $resultado = Validator::make($parametros,$validation_rules,$validation_eror_messages);

            if($resultado->passes()){
                DB::beginTransaction();

                $rol = Role::create($parametros);

                //$permissions = array_map(function($n){ return $n['id']; },$parametros['permissions']);
                $permissions = $parametros['permissions'];

                if($rol){
                    $rol->permissions()->sync($permissions);
                    $rol->save();
                    DB::commit();
                    return response()->json(['data'=>$rol], HttpResponse::HTTP_OK);
                }else{
                    DB::rollback();
                    return response()->json(['error'=>'No se pudo crear el Rol'], HttpResponse::HTTP_CONFLICT);
                }
                
            }else{
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }
        }catch(\Exception $e){
            DB::rollback();
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar guardar el rol',null,$e);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $this->authorize('has-permission',\Permissions::CRUD_ROLES);
        try{
            $rol = Role::with(['permissions','users'=>function($users){
                                                        $users->select('id','username','name','avatar','status');
                                                    }])->find($id);
            $rol->users->makeHidden('pivot');
            $rol->permissions->makeHidden('pivot');
            return response()->json(['data'=>$rol],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener los datos del rol',null,$e);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->authorize('has-permission',\Permissions::CRUD_ROLES);
        try{
            $validation_rules = [
                'name' => 'required',
                'permissions' => 'required|min:1'
            ];
        
            $validation_eror_messages = [
                'name.required' => 'El nombre es requerido',
                'permission.required' => 'Es requerido tener permisos asignados',
                'permission.min' => 'Se debe tener al menos un permiso asignado'
            ];

            
            $parametros = $request->all();

            $resultado = Validator::make($parametros,$validation_rules,$validation_eror_messages);

            if($resultado->passes()){
                DB::beginTransaction();

                $rol = Role::with('permissions')->find($id);

                $rol->name      = $parametros['name'];
                
                //$permissions = array_map(function($n){ return $n['id']; },$parametros['permissions']);
                $permissions = $parametros['permissions'];

                if($rol){
                    $rol->permissions()->sync($permissions);
                    $rol->save();
                    DB::commit();
                    return response()->json(['data'=>$rol], HttpResponse::HTTP_OK);
                }else{
                    DB::rollback();
                    return response()->json(['error'=>'No se pudo crear el Rol'], HttpResponse::HTTP_CONFLICT);
                }
            }else{
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }
        }catch(\Exception $e){
            DB::rollback();
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar modificar el rol',null,$e);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->authorize('has-permission',\Permissions::CRUD_ROLES);
        try{
            $rol = Role::find($id);
            $rol->permissions()->detach();
            $rol->users()->detach();
            $rol->delete();

            return response()->json(['data'=>'Rol eliminado'], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar eliminar el rol',null,$e);
        }
    }
}
