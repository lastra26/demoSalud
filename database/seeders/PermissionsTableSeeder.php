<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $basic_permissions = [
            ['id'=>'hr5UhgMTDmF9EiLYeq5x0cz0e281IWRU','description'=>'Admin Usuarios',           'group'=>'SYS-ADMIN/CRUD-USUARIOS',    'is_super'=>false ],
            ['id'=>'gzA7BboE1BpzXZmko6OIDT3EOQRn4otm','description'=>'Admin Roles',              'group'=>'SYS-ADMIN/CRUD-ROLES',       'is_super'=>false ],
            ['id'=>'tOJt3Tw42CjDT8Ob5164lwm2i3FCxJCR','description'=>'Ver Permisos',             'group'=>'SYS-ADMIN/VER-PERMISOS',     'is_super'=>false ],
            ['id'=>'tTVayONYIDylH9dk7jg5143h0FKoSpBi','description'=>'Admin Permisos',           'group'=>'SYS-ADMIN/CRUD-PERMISOS',    'is_super'=>true  ],
            ['id'=>'6ARHQGj1N8YPkr02DY04K1Zy7HjIdDcj','description'=>'Herramientas Dev',         'group'=>'DEV-TOOLS',                  'is_super'=>true  ],
        ];

        foreach ($basic_permissions as $permission) {
            \App\Models\Permission::create($permission);
        }
    }
}
