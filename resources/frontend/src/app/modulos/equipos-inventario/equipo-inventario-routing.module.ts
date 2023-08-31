import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
//import { IndexComponent } from './index/index.component';
import { FormEquipoInventarioComponent } from './form-equipo-inventario/form-equipo-inventario.component';

const routes: Routes = [
  //{ path: 'control-acceso',           component: IndexComponent,          canActivate: [AuthGuard] },
  { path: 'equipo-inventario',  component: FormEquipoInventarioComponent,  canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipoInventarioRoutingModule { }
