import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsuariosService } from '../usuarios.service'; 
import { DialogoUsuarioComponent } from '../dialogo-usuario/dialogo-usuario.component';
import { USER_STATUS_CATALOG } from '../userStatus';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { ReportWorker } from 'src/app/web-workers/report-worker';
import * as FileSaver from 'file-saver';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) { }

  isLoadingResults:boolean;
  isLoadingPDF:boolean;

  searchQuery:string;

  statusDesc:any = USER_STATUS_CATALOG;

  pageSize:number = 50;
  displayedColumns: string[] = ['status','username','name','email','last_login_at','updated_at'];
  resultsLength = 0;
  data:any;

  ngOnInit(): void {
    this.data = [];
    this.searchQuery = '';

    setTimeout(() => {
      this.applySearch();
    }, 10);
  }

  ngAfterViewInit(){
    // If the user changes the sort order, reset back to the first page.console.log('this.paginator.pageIndex = 0')
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.applySearch();
    });

    this.paginator.page.subscribe(()=>{
      if(this.pageSize != this.paginator.pageSize){
        this.paginator.pageIndex = 0;
        this.pageSize = this.paginator.pageSize;
      }
      this.applySearch();
    });
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  applySearch(){
    this.isLoadingResults = true;
    let params:any = {
      sort: this.sort.active,
      direction: this.sort.direction,
      page: this.paginator.pageIndex+1,
      per_page: this.paginator.pageSize,
      query: this.searchQuery,
    };
    
    this.data = [];

    return this.usuariosService.obtenerUsuarios(params).subscribe({
      next:(response:any) => {
        this.isLoadingResults = false;
        this.resultsLength = response.data.total;
        this.data = response.data.data;
      },
      error:(response:any) => {
        this.alertPanel.showError(response.error.message);
        this.isLoadingResults = false;
      }
    });
  }

  changeStatusUser(id,status){
    let message:string;
    let icon:string;
    let btn_text:string;
    let color:string;

    if(status == 4){
      message = 'Esta seguro de Banear a este usuario?';
      btn_text = 'Banear';
      icon = 'block';
      color = 'warn';
    }else{
      message = 'Esta seguro de Activar a este usuario?';
      btn_text = 'Activar';
      icon = 'done_outline';
      color = 'primary';
    }

    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: {title:'Modificar Estatus',message: message, hasOKBtn:true, btnColor: color, btnText: btn_text, btnIcon:icon}
    });
    //data:{message: 'Se enviara un correo electronico para que el usuario pueda restaurar su contraseña', hasOKBtn:true, btnText:'Enviar Correo', btnIcon:'send'}
    let params:any = {status: status};
    
    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.usuariosService.cambiarStatus(id,params).subscribe(
          response => {
            this.applySearch();
          }
        );
      }
    });
  }

  openDialogUser(id?){
    let dialogConfig:any = {
      maxWidth: '100%',
      width: '80%',
      height: '60%',
      disableClose: true,
      data:{}
    };

    if(id){
      dialogConfig.data.id = id;
    }

    const dialogRef = this.dialog.open(DialogoUsuarioComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.applySearch();
      }
    });

  }

  exportPDF(){
    if(!this.isLoadingPDF){
      this.isLoadingPDF = true;

      let params:any = {
        sort: this.sort.active,
        direction: this.sort.direction,
        query: this.searchQuery,
      };

      return this.usuariosService.obtenerUsuarios(params).subscribe({
        next:(response:any) => {
          if(response.data.length > 0){
            
            let fecha_reporte = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());

            const reportWorker = new ReportWorker();
            reportWorker.onmessage().subscribe(
              data => {
                FileSaver.saveAs(data.data,'Reporte-Usuarios '+'('+fecha_reporte+')');
                
                reportWorker.terminate();
                this.isLoadingPDF = false;
            });

            reportWorker.onerror().subscribe(
              (data) => {
                //this.sharedService.showSnackBar(data.message, null, 3000);
                this.alertPanel.showError(data.message);
                this.isLoadingPDF = false;
                reportWorker.terminate();
              }
            );
            
            let config:any = {}; //Aqui se puede configurar las firmas
            let user:any = this.authService.getUserData();

            config.firmas = [
              {etiqueta:'REALIZÓ', nombre: user.name, cargo:'Usuario del Sistema'},
              {etiqueta:'REVISÓ', nombre: '', cargo:'Responsable del Sistema'},
            ];
            
            let reporteData:any = {items: response.data, config:config};
            reportWorker.postMessage({data:reporteData,reporte:'control-acceso/usuarios'});

          }else{
            this.alertPanel.showInfo('No se encontraron resultados');
            this.isLoadingPDF = false;
          }
        },
        error:(response:any) => {
          this.alertPanel.showError(response.error.message);
          this.isLoadingPDF = false;
        }
      });
    }
  }

}
