import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { DialogActivateUserComponent } from '../dialog-activate-user/dialog-activate-user.component';

@Component({
  selector: 'app-dialog-forgot-password',
  templateUrl: './dialog-forgot-password.component.html',
  styleUrls: ['./dialog-forgot-password.component.css']
})
export class DialogForgotPasswordComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogActivateUserComponent>,
    private authService: AuthService,
  ) { }

  userMail:FormControl;
  sentTo:string;

  isLoading:boolean;
  success:boolean;

  errorMessage:string;

  ngOnInit(): void {
    this.dialogRef.addPanelClass('no-padding-dialog');
    this.userMail = new FormControl('',Validators.required);
  }

  resetPassword(){
    this.errorMessage = '';
    if(this.userMail.valid){
      this.isLoading = true;
      let params:any = {user_email:this.userMail.value};

      this.authService.sendResetPassword(params).subscribe({
        next: (response:any)=>{
          this.sentTo = response.email;
          this.isLoading = false;
          this.success = true;
        },
        error: (response:any)=>{
          this.errorMessage = response.error.message;
          this.isLoading = false;
        }
      });
    }
  }

  cerrar(){
    this.dialogRef.close();
  }

}
