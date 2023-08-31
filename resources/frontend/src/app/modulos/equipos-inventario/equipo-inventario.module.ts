import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipoInventarioRoutingModule } from './equipo-inventario-routing.module';
//import { IndexComponent } from './index/index.component';

import { FormEquipoInventarioComponent } from './form-equipo-inventario/form-equipo-inventario.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    //IndexComponent,
    FormEquipoInventarioComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EquipoInventarioRoutingModule
  ]
})
export class EquipoInventarioModule { }
