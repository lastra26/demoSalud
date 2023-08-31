import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomValidator } from 'src/app/utils/classes/custom-validator';
import { AuthService } from '../auth.service';

export interface DialogData {
  user: any;
}

@Component({
  selector: 'app-dialog-activate-user',
  templateUrl: './dialog-activate-user.component.html',
  styleUrls: ['./dialog-activate-user.component.css']
})

export class DialogActivateUserComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogActivateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  formPasswords:FormGroup;

  isLoading:boolean;

  showPassword:boolean;
  showNewPassword:boolean;
  showConfirmPassword:boolean;

  errorMessage:string;

  ngOnInit(): void {
    this.dialogRef.addPanelClass('no-padding-dialog-overflow');
    
    this.formPasswords = this.formBuilder.group({
      'id':                         [''],
      'username':                   [''],
      'password':                   ['',[Validators.required, Validators.minLength(8)]],
      'new_password':               ['',[Validators.required, Validators.minLength(8)]],
      'confirm_password':           ['',[Validators.required, CustomValidator.fieldMatchValidator('new_password')]],
      'valid_password':             [false,Validators.requiredTrue],
    });

    this.formPasswords.patchValue(this.inData.user);
  }

  activateUser(){
    this.errorMessage = '';
    if(this.formPasswords.valid){
      this.isLoading = true;
      let data:any = this.formPasswords.value;

      this.authService.resetPassword(data).subscribe({
        next:(response:any) => {
          this.dialogRef.close(response);
        },
        error:(response:any)=>{
          if(response.error.error_type == 'wrong_pass'){
            this.formPasswords.get(response.error.field).setErrors({wrongPass:true});
          }else{
            this.errorMessage = response.error.message;
          }
          this.isLoading = false;
        }
      });
    }
  }

  passwordValid(event){
    this.formPasswords.get('valid_password').patchValue(event);
    this.formPasswords.get('confirm_password').patchValue('');
  }

  cerrar(){
    this.dialogRef.close();
  }

}
