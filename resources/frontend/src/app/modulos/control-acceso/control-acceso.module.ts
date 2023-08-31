import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlAccesoRoutingModule } from './control-acceso-routing.module';
import { IndexComponent } from './index/index.component';
import { ListaUsuariosComponent } from './usuarios/lista-usuarios/lista-usuarios.component';
import { DialogoUsuarioComponent } from './usuarios/dialogo-usuario/dialogo-usuario.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WidgetBuscadorUnidadesComponent } from './shared/widget-buscador-unidades/widget-buscador-unidades.component';
import { TabPermissionsComponent } from './usuarios/inner-components/tab-permissions/tab-permissions.component';
import { TabRolesComponent } from './usuarios/inner-components/tab-roles/tab-roles.component';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';

@NgModule({
  declarations: [
    IndexComponent,
    ListaUsuariosComponent,
    DialogoUsuarioComponent,
    TabPermissionsComponent,
    TabRolesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RolesModule,
    PermissionsModule,
    WidgetBuscadorUnidadesComponent,
    ControlAccesoRoutingModule
  ]
})
export class ControlAccesoModule { }
