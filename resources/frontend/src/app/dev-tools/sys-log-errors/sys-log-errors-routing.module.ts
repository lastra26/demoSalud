import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { ListaComponent } from './lista/lista.component';

const routes: Routes = [
  { path: 'dev-tools/sys-log-errors', component: ListaComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysLogErrorsRoutingModule { }
