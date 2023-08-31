import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsRoutingModule } from './tickets-routing.module';
import { IndexComponent } from './index/index.component';
import { ListaTicketsComponent } from './lista-tickets/lista-tickets.component';
import { FormTicketsComponent } from './form-ticket/form-ticket.component';
import { TabSegumientoComponent } from './inner-components/tab-seguimiento/seguimiento-ticket.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormAsignarTicketComponent } from './inner-components/asignar-ticket/asignar-ticket.component';
import { FormGenerarSeguimientoComponent } from './inner-components/generar-seguimiento/generar-seguimiento.component';
import { ListaTicketsAsignadosComponent } from './lista-tickets-asignados/lista-tickets-asignados.component';

@NgModule({
  declarations: [
    IndexComponent,
    ListaTicketsComponent,
    FormTicketsComponent,
    TabSegumientoComponent,
    FormAsignarTicketComponent,
    FormGenerarSeguimientoComponent,
    ListaTicketsAsignadosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TicketsRoutingModule
  ]
})
export class TicketsModule { }
