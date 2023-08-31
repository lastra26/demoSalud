import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DialogActivateUserComponent } from '../dialog-activate-user/dialog-activate-user.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogForgotPasswordComponent } from '../dialog-forgot-password/dialog-forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('inputPassword') inputPassword: ElementRef;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) { }

  loginForm: UntypedFormGroup;
  isLoading:boolean = false;
  avatarPlaceholder = 'assets/profile-icon.svg';
  errorMessage:string;

  ngOnInit() {
    this.loginForm = new UntypedFormGroup({
      usuario: new UntypedFormControl('',{ validators: [Validators.required] }),
      password: new UntypedFormControl('', { validators: [Validators.required] })
    });
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.isLoading = true;
      this.errorMessage = '';
      let usuario   = this.loginForm.value.usuario;
      let password  = this.loginForm.value.password;

      this.authService.logIn( usuario,password ).subscribe({
        next:(response) => {
          if(response.status == 'OK'){
            this.successLogin(response);
          }else if(response.status == 'activate_user'){
            let dialogConfig:any = {
              //maxWidth: '380px',
              disableClose: false,
              data:{user: response.usuario},
            };
        
            const dialogRef = this.dialog.open(DialogActivateUserComponent,dialogConfig);
        
            dialogRef.afterClosed().subscribe(result => {
              console.log(`Dialog result: ${result}`);
              if(result){
                this.successLogin(result);
              }else{
                this.errorMessage = 'El Usuario no esta activo';
              }
            });
          }

          this.isLoading = false;
        },
        error:(response: HttpErrorResponse) => {
          //if(response)
          this.errorMessage = response.error.message;
          /*let errorMessage =  Object.keys(error.error)[0];
          if(error.status != 401){
            errorMessage = "Ocurrió un error.";
          }
          this.sharedService.showSnackBar(error.error[errorMessage], 'Cerrar', 5000);
          */
          this.isLoading = false;

          this.inputPassword.nativeElement.value = '';
          this.inputPassword.nativeElement.focus();
        },
        /*complete:() => {
          this.sharedService.showSnackBar('¡Bienvenido al Sistema!', 'Cerrar', 3000);
        },*/
      });
    }
  }

  successLogin(response:any){
    let loginHistory:any = {};
    if(localStorage.getItem('loginHistory')){
      loginHistory = JSON.parse(localStorage.getItem('loginHistory'));
    }
    loginHistory[response.user_data.username] = response.user_data.avatar;
    localStorage.setItem('loginHistory',JSON.stringify(loginHistory));
    //localStorage.setItem('DataServer',JSON.stringify(response.xDataServer));

    this.router.navigate(['/apps']);
  }

  showResetPassword(){
    let dialogConfig:any = {
      maxWidth: '380px',
      disableClose: false,
      data:{},
    };

    this.dialog.open(DialogForgotPasswordComponent,dialogConfig);
  }

  checkAvatar(username){
    this.avatarPlaceholder = 'assets/profile-icon.svg';

    if(localStorage.getItem('loginHistory')){
      let loginHistory = JSON.parse(localStorage.getItem('loginHistory'));
      
      if(loginHistory[username]){
        this.avatarPlaceholder = loginHistory[username];
      }
    }
  }

}
