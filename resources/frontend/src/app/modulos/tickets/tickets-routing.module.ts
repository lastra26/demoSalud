import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { IndexComponent } from './index/index.component';
import { ListaTicketsComponent } from './lista-tickets/lista-tickets.component';
import { ListaTicketsAsignadosComponent } from './lista-tickets-asignados/lista-tickets-asignados.component';

const routes: Routes = [
  { path: 'tickets',             component: ListaTicketsComponent,            canActivate: [AuthGuard] },
  { path: 'tickets-asignados',   component: ListaTicketsAsignadosComponent,   canActivate: [AuthGuard] },
  { path: 'tickets/dashboard',   component: IndexComponent,                   canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }
