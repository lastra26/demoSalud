import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title?: string;
  message: string;
  hasOKBtn?: boolean;
  validationString?: string;
  btnColor?: string;
  btnText?: string;
  btnIcon?: string;
}

@Component({
  selector: 'app-dialog-confirm-action',
  templateUrl: './dialog-confirm-action.component.html',
  styleUrls: ['./dialog-confirm-action.component.css']
})
export class DialogConfirmActionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {}

  title:string;
  color:string;
  btnText:string;
  btnIcon:string;

  needsConfirm:boolean;
  onlyBtnLabel:string;
  onlyBtnIcon:string;

  message:string;

  confirmValue:string;
  checkValue:boolean;
  validationString:string;

  confirmForm: UntypedFormGroup;
  
  ngOnInit(){
    this.dialogRef.addPanelClass('no-padding-dialog');
    
    this.validationString = this.data.validationString || undefined;
    
    if(this.validationString){
      this.checkValue = true;
    }else{
      this.checkValue = false;
    }

    this.message = this.data.message;
    this.title = this.data.title || undefined;
    
    this.needsConfirm = this.data.hasOKBtn || false;

    if(this.needsConfirm || this.checkValue){
      this.onlyBtnLabel = 'Cancelar';
      this.btnText = this.data.btnText || 'Aceptar';
      this.color = this.data.btnColor || 'primary';
      this.btnIcon = this.data.btnIcon || '';
    }else{
      this.onlyBtnLabel = this.data.btnText || 'Aceptar';
      this.onlyBtnIcon = this.data.btnIcon || '';
    }

    this.confirmForm = this.fb.group({
      'confirm-text': ['',[Validators.required,Validators.pattern(this.validationString)]]
    });
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirm():void {
    if(this.confirmForm.valid){
      this.dialogRef.close(true);
    }
  }
}
