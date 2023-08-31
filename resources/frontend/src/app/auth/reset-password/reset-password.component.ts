import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { CustomValidator } from 'src/app/utils/classes/custom-validator';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  formPasswords:FormGroup;

  isLoading:boolean;

  showPassword:boolean;
  showConfirmPassword:boolean;

  errorMessage:string;

  ngOnInit(): void {
    this.formPasswords = this.formBuilder.group({
      'activation_token':           [''],
      'new_password':               ['',[Validators.required, Validators.minLength(8)]],
      'confirm_password':           ['',[Validators.required, CustomValidator.fieldMatchValidator('new_password')]],
      'valid_password':             [false,[Validators.requiredTrue]],
    });

    this.route.paramMap.subscribe(params => {
      if(params.get('token')){
        this.formPasswords.get('activation_token').patchValue(params.get('token'));
      }
    });
  }

  resetPassword(){
    this.alertPanel.closePanel();
    if(this.formPasswords.valid){
      this.isLoading = true;
      let data:any = this.formPasswords.value;

      this.authService.resetPassword(data).subscribe({
        next:(response:any) => {
          let dialogConfig:any = {
            data:{message: response.message, btnText:'Ir a Iniciar Sesión'}
          };

          const dialogRef = this.dialog.open(DialogConfirmActionComponent,dialogConfig);
      
          dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['/login']);  
          });

          this.isLoading = false;
        },
        error:(response:any)=>{
          this.alertPanel.showError(response.error.message);
          this.isLoading = false;
        }
      });
    }
  }

  passwordValid(event){
    this.formPasswords.get('valid_password').patchValue(event);
    this.formPasswords.get('confirm_password').patchValue('');
  }

}
