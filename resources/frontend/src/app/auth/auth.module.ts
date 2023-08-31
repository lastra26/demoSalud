import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { DialogForgotPasswordComponent } from './dialog-forgot-password/dialog-forgot-password.component';
import { DialogActivateUserComponent } from './dialog-activate-user/dialog-activate-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
//import { StrengthCheckerComponent } from '../utils/components/strength-checker/strength-checker.component';


@NgModule({
  declarations: [LoginComponent, DialogForgotPasswordComponent, DialogActivateUserComponent, ResetPasswordComponent],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
