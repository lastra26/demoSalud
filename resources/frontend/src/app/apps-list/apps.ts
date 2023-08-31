export class App {
    name:string;
    route: string;
    icon: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    hideHome?:boolean; //Si es verdadero ocultara el elemento que dirige a raiz, en la lista que aparece en los modulos con hijos (la raiz es la ruta de la aplicación padre)
    isHub?:boolean; //Si es verdadero solo mostrara la aplicación en el HUB cuando tenga al menos un hijo activo, de lo contario se ocultara, si es falso siempre estara presente en el HUB (tomando encuenta los permisos asignados) sin importar si tiene hijos o no activos
    children?:App[]; //Lista de modulos y componentes hijos de la aplicación
    apps?:App[]; //Hub secundario de apps
    menu?:Menu[];
}

export class Menu {
    name:string;
    identificador?:string;
    icon?: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    children:App[]
}

export const APPS:App [] = [
    { name:'Herramientas Dev', route: "dev-tools",  icon: "assets/icons/herra_dev.svg", isHub:true, hideHome:true, permission:"6ARHQGj1N8YPkr02DY04K1Zy7HjIdDcj",
      menu:[
        {
            name:'Tools',
            icon:'settings',
            identificador:'tools',
            children:[
                {name:'Log de Excepciones',   route:'dev-tools/sys-log-errors', icon:'report'               },
                {name:'Reportes MySQL',       route:'dev-tools/mysql-reportes', icon:'insert_drive_file'    },
            ]
        },
      ],
    },
    { name:'Control de Acceso', route: "control-acceso",  icon: "assets/icons/control_acceso_azul.svg", 
        menu:[
            {
                name:'Administrar',
                icon: 'menu_open',
                identificador:'administracion',
                children:[
                    { name:"Usuarios",      route: "control-acceso/usuarios",          icon: "manage_accounts",        permission:"hr5UhgMTDmF9EiLYeq5x0cz0e281IWRU" },
                    { name:'Roles',         route: "control-acceso/roles",             icon: "groups_2",               permission:"gzA7BboE1BpzXZmko6OIDT3EOQRn4otm" },
                ]
            },
            {
                name:'Config',
                icon: 'admin_panel_settings',
                identificador:'configuracion',
                children:[
                    { name:'Permisos',      route: "control-acceso/permisos",          icon: "key",                    permission:"tTVayONYIDylH9dk7jg5143h0FKoSpBi" },
                ]
            }
        ] 
    },
    { name:'Tickets de Servicio', route: "tickets",  icon: "assets/icons/tickets/tickets_servicio.svg", 
        menu:[
            {
                name:'Tickets',
                icon: 'menu_open',
                identificador:'admin_tickets',
                children:[
                    { name:"Tickets",                route: "tickets",              icon: "manage_accounts",        permission:"" },
                ]
            },
        ] 
    },

    { name:'Tickets Asignados', route: "tickets-asignados",  icon: "assets/icons/tickets/tickets_asignados.svg", 
        menu:[] 
    },
]