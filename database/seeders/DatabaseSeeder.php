<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(){
        \App\Models\User::create([
            'name' => 'Usuario Root',
            'username' => 'root',
            'password' => Hash::make('ssa.tickets'),
            'email' => 'root@localhost',
            'is_superuser' => 1,
            'avatar' => 'assets/avatars/50-king.svg',
            'status' => 2,
        ]);

        $this->call(PermissionsTableSeeder::class);

        //Carga de archivos CSV
        $lista_csv = [
            'roles',
            'permission_role',
            'role_user'
        ];

        foreach($lista_csv as $csv){
            $archivo_csv = storage_path().'/app/seeds/'.$csv.'.csv';

            $query = sprintf("
                LOAD DATA local INFILE '%s' 
                INTO TABLE $csv 
                FIELDS TERMINATED BY ',' 
                OPTIONALLY ENCLOSED BY '\"' 
                ESCAPED BY '\"' 
                LINES TERMINATED BY '\\n' 
                IGNORE 1 LINES", addslashes($archivo_csv));
            echo $query;
            DB::connection()->getpdo()->exec($query);
        }
           
        
    }
}
