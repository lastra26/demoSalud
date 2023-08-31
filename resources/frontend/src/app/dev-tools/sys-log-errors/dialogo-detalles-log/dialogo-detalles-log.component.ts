import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SysLogErrorsService } from '../sys-log-errors.service';


export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-dialogo-detalles-log',
  templateUrl: './dialogo-detalles-log.component.html',
  styleUrls: ['./dialogo-detalles-log.component.css']
})
export class DialogoDetallesLogComponent implements OnInit {

  constructor(
    private sysLogErrorsService: SysLogErrorsService,
    public dialogRef: MatDialogRef<DialogoDetallesLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  isLoading:boolean;
  dialogMaxSize:boolean;
  logData:any;

  ngOnInit(): void {
    this.isLoading = true;
    this.sysLogErrorsService.getLog(this.data.id).subscribe({
      next: (response:any) => {
        console.log(response);
        if(response.error){
          //
        }else{
          this.logData = response.data;
        }
        this.isLoading = false;
      },
      error: (responseError:any)=>{
        this.isLoading = false;
      }
    })
  }

  resizeDialog(){
    if(!this.dialogMaxSize){
      this.dialogRef.updateSize('100%', '100%');
      this.dialogMaxSize = true;
    }else{
      this.dialogRef.updateSize('90%','80%');
      this.dialogMaxSize = false;
    }
  }

  cerrar(){
    this.dialogRef.close();
  }

}
