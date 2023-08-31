import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { IfHasPermissionDirective } from './if-has-permission.directive';

import { AppHubComponent } from './components/app-hub/app-hub.component';
import { MascaraFechaDirective } from './mascara-fecha.directive';
import { AlertPanelComponent } from './components/alert-panel/alert-panel.component'; 
import { DialogConfirmActionComponent } from './components/dialog-confirm-action/dialog-confirm-action.component';
import { StrengthCheckerComponent } from '../utils/components/strength-checker/strength-checker.component';

@NgModule({
  declarations: [IfHasPermissionDirective, AppHubComponent, MascaraFechaDirective, AlertPanelComponent, DialogConfirmActionComponent, StrengthCheckerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    IfHasPermissionDirective,
    MascaraFechaDirective,
    AlertPanelComponent,
    DialogConfirmActionComponent,
    StrengthCheckerComponent,
    AppHubComponent,
  ],
})
export class SharedModule { }
