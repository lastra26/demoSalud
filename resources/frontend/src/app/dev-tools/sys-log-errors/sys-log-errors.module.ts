import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SysLogErrorsRoutingModule } from './sys-log-errors-routing.module';
import { ListaComponent } from './lista/lista.component';
import { DialogoDetallesLogComponent } from './dialogo-detalles-log/dialogo-detalles-log.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListaComponent,
    DialogoDetallesLogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SysLogErrorsRoutingModule
  ]
})
export class SysLogErrorsModule { }
