import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { DialogoDetallesLogComponent } from '../dialogo-detalles-log/dialogo-detalles-log.component';
import { SysLogErrorsService } from '../sys-log-errors.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
  providers:[
    DatePipe,
  ]
})
export class ListaComponent implements OnInit {

  @ViewChild(AlertPanelComponent) alertPanel:AlertPanelComponent;

  constructor(
    private sysLogErrorsService: SysLogErrorsService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
  ) { }

  isLoading:boolean;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  listadoResultados: any[] = [];
  displayedColumns: string[] = ['id','archivo','mensaje','usuario','fecha'];

  filtro:any;

  ngOnInit(): void {
    this.isLoading = true;
    this.filtro = {
      rango_fechas: {inicio:'', fin:''},
      query: '',
    };

    this.loadResultados();
  }

  loadResultados(event?){
    this.isLoading = true;
    //this.alertPanel.cerrarAlerta();

    //let params = this.obtenerParametros();
    let params:any = {};

    //console.log(this.filtro);

    if(this.filtro.query){
      params.query = this.filtro.query;
    }

    if(this.filtro.rango_fechas.inicio){
      params.fecha_inicio = this.datePipe.transform(this.filtro.rango_fechas.inicio, 'yyyy-MM-dd');
      params.fecha_fin = this.datePipe.transform(this.filtro.rango_fechas.fin, 'yyyy-MM-dd');
    }

    if(!event){
      params.page= 1; 
      params.per_page= this.pageSize;
    }else{
      params.page = event.pageIndex+1;
      params.per_page = event.pageSize;
    }
    
    this.resultsLength = 0;
    this.listadoResultados = [];
    
    this.sysLogErrorsService.obtenerListaRegistros(params).subscribe({
      next: (response:any) =>{
        if(response.error) {
          let errorMessage = response.error.message;
          //this.alertPanel.mostrarError('Error: '+errorMessage);
        } else {
          if(response.total > 0){
            this.listadoResultados = response.data;
            this.resultsLength = response.total;
          }
        }
        this.isLoading = false;
      },
      error:(response:any) =>{
        var errorMessage = "Ocurrió un error.";
        if(response.status == 409){
          errorMessage = response.error.message;
        }
        this.alertPanel.showError(errorMessage);
        this.isLoading = false;
      }
    });
    return event;
  }

  mostrarDetalles(id:number){
    const dialogRef = this.dialog.open(DialogoDetallesLogComponent, {
      width: '90%',
      height: '80%',
      maxWidth: '100%',
      data:{id: id},
      panelClass: 'no-padding-dialog'
    });
  }

  checarFechasFiltro(){
    if(this.filtro.rango_fechas.inicio && !this.filtro.rango_fechas.fin){
      this.filtro.rango_fechas.fin = this.filtro.rango_fechas.inicio;
    }
  }

  limpiarCampoFechas(){
    this.filtro.rango_fechas = {inicio:'', fin:''};
  }

}
