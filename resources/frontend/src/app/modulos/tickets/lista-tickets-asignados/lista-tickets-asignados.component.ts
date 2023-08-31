import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TicketsService } from '../tickets.service'; 
//import { DialogoUsuarioComponent } from '../dialogo-usuario/dialogo-usuario.component';
//import { USER_STATUS_CATALOG } from '../userStatus';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { ReportWorker } from 'src/app/web-workers/report-worker';
import * as FileSaver from 'file-saver';
import { AuthService } from 'src/app/auth/auth.service';

import { FormTicketsComponent } from '../form-ticket/form-ticket.component';
import { FormAsignarTicketComponent } from '../inner-components/asignar-ticket/asignar-ticket.component';
import { FormGenerarSeguimientoComponent } from '../inner-components/generar-seguimiento/generar-seguimiento.component';
import { FormEquipoInventarioComponent } from '../../equipos-inventario/form-equipo-inventario/form-equipo-inventario.component';

@Component({
  selector: 'app-lista-tickets-asignados',
  templateUrl: './lista-tickets-asignados.component.html',
  styleUrls: ['./lista-tickets-asignados.component.css']
})
export class ListaTicketsAsignadosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private ticketsService: TicketsService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) { }

  isLoadingResults:boolean;
  isLoadingPDF:boolean;

  searchQuery:string;
  

  //statusDesc:any = USER_STATUS_CATALOG;

  displayedColumns: string[] = ['fecha_ticket','persona','cr','tipo_problema','observaciones','status_seguimiento','updated_at'];
  resultsLength = 0;
  data:any;
  pageSize:number = 50;

  ngOnInit(): void {
    this.data = [];
    this.searchQuery = '';

    setTimeout(() => {
      this.applySearch();
    }, 10);
  }

  ngAfterViewInit(){
    // If the user changes the sort order, reset back to the first page.console.log('this.paginator.pageIndex = 0')
    this.sort?.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.applySearch();
    });

    this.paginator?.page.subscribe(()=>{
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
      sort: this.sort?.active,
      direction: this.sort?.direction,
      page: this.paginator?.pageIndex+1,
      per_page: this.paginator?.pageSize,
      query: this.searchQuery,
    };
    
    this.data = [];

    return this.ticketsService.obtenerSeguimientosColaborador(params).subscribe({
      next:(response:any) => {
        console.log("datos",response);
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

  openDialogEquipoTicket(tipo_equipo?, persona?){

    console.log(persona, tipo_equipo);

    let dialogConfig:any = {
      maxWidth: '100%',
      width: '90%',
      height: '80%',
      disableClose: true,
      data:{}
    };

    if(persona != null){
      dialogConfig.data = {
        persona: persona,
        tipo_equipo: tipo_equipo
      };
    }else{
      dialogConfig.data = {
        persona: null,
        tipo_equipo: tipo_equipo
      };
    }

    const dialogRef = this.dialog.open(FormEquipoInventarioComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.applySearch();
      }
    });

  }

  openDialogAsignarTicket(id, seguimiento_id){
    console.log("aaa",seguimiento_id);

    let dialogConfig:any = {
      maxWidth: '100%',
      width: '90%',
      height: '70%',
      disableClose: true,
      data:{}
    };

    if(id && seguimiento_id){
      dialogConfig.data.ticket_id = id;
      dialogConfig.data.seguimiento_id = seguimiento_id;
    }

    const dialogRef = this.dialog.open(FormAsignarTicketComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.applySearch();
      }
    });

  }

  openDialogGenerarSeguimiento(id?){

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

    const dialogRef = this.dialog.open(FormGenerarSeguimientoComponent, dialogConfig);

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

      return this.ticketsService.obtenerTickets(params).subscribe({
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
