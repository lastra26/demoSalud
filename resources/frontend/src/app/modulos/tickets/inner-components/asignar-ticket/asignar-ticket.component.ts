import { Component, Inject, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { TicketsService } from '../../tickets.service';

//Para checar tamaño de la pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Subject, Observable} from 'rxjs';
import { takeUntil, startWith, map, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';



export interface DialogData {
  ticket_id: number;
  seguimiento_id: number;
}

@Component({
  selector: 'asignar-ticket',
  templateUrl: './asignar-ticket.component.html',
  styleUrls: ['./asignar-ticket.component.css']
})
export class FormAsignarTicketComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  @ViewChild('tableColaboradores', { static: false }) tableColaboradores;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  //@Output() public onFormGroupSeguimiento = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<FormAsignarTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public seguimiento: DialogData,
    private ticketsService: TicketsService,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
        }
      }
    });
  }

  destroyed = new Subject<void>();
  currentScreenSize: string;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'xs'],
    [Breakpoints.Small, 'sm'],
    [Breakpoints.Medium, 'md'],
    [Breakpoints.Large, 'lg'],
    [Breakpoints.XLarge, 'xl'],
  ]);

  isEdit:boolean = false;
  isLoading:boolean;
  isSaving:boolean = false;
  dialogMaxSize:boolean;

  formAsignarTicket:FormGroup;
  asignar:FormGroup;
  items: FormArray;

  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;

  filterCatalogs:any = {};
  filteredCatalogs:any = {};
  catalogos: any = {};
  datos:any
  savedData:boolean;

  pageSize:number = 3;
  resultsLength = 0;
  filteredColaboradores: Observable<any[]>;
  colaboradorIsLoading: boolean = false;
  displayedColumnsColaboradores: string[] = ['no', 'no_seguimiento', 'fechas_solucion', 'nombre_completo', 'observaciones', 'actions'];
  dataSourceColaboradores:any = new MatTableDataSource();
  valorColaborador: any[] = [];

  dataColaboradores = Object.assign( this.valorColaborador );
  fechas: any = {accion:false, rango_fechas:{inicio:null, fin:null}};
  uid = 0;


  ngOnInit(): void {

    this.paginator = this.dataColaboradores.length;
    console.log("ffff", this.seguimiento);

    this.isLoading = true;
    this.dialogRef.addPanelClass('no-padding-dialog');

    this.formAsignarTicket = this.formBuilder.group({

      'id':                     [''],
      'uid':                    [''],
      'seguimiento_id':         [''],
      'colaborador_id':         [''],
      'status_seguimiento_id':  [''],
      'tiempo_transcurrido':    [''],
      'fecha_inicio':           ['',Validators.required],
      'fecha_fin':              ['',Validators.required],
      'observaciones':          ['',Validators.required],
      'colaborador':            ['',Validators.required]

    });



    this.initCatalogs(null);
    this.getFirstSeguimiento(this.seguimiento?.ticket_id);

    //this.onFormGroupSeguimiento.emit(this.formAsignarTicket);

    console.log("id seguimiento", this.seguimiento);


  }

  public getFirstSeguimiento(ticket_id:number){

    if(ticket_id){
      this.ticketsService.verSeguimiento(ticket_id).subscribe({
        next: (response:any)=>{
          console.log("seguimiento",response?.data);
          this.isLoading = false;
        },
        error: (response:any)=>{
          this.alertPanel.showError(response.error.message);
          this.isLoading = false;
        }
      });
    }else{
      this.setConfigForm();
      this.isLoading = false;
    }

  }

  valorr(){
    console.log('form', this.formAsignarTicket.value);
  }

  private nextUid() {
    ++this.uid
    return this.uid;
  }

  private previoUid(){
    --this.uid
    return this.uid;
  }

  checarFechasFiltro(){
    if(this.fechas.rango_fechas.inicio && !this.fechas.rango_fechas.fin){
      this.fechas.rango_fechas.fin = this.fechas.rango_fechas.inicio;
    }
    console.log("aca",this.formAsignarTicket.value);
  }


  public initCatalogs(params_edit){

    this.isLoading = true;

    const carga_catalogos = [
      {nombre:'status_seguimiento',orden:'id'},
      {nombre:'colaboradores',orden:'id'},
      
    ];

    this.ticketsService.obtenerCatalogos(carga_catalogos).subscribe({
        
      next:(response) => {
            this.catalogos = response.data;

            const assigned = response.data['colaboradores'].map(item => ({...item, isAssigned: false}))

            this.catalogos['colaboradores'] = assigned;
            
            this.filteredCatalogs['status_seguimiento']   = this.formAsignarTicket.get('status_seguimiento_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'status_seguimiento','descripcion')));
            this.filteredCatalogs['colaboradores']        = this.formAsignarTicket.get('colaborador').valueChanges.pipe(startWith(''),map(value => this._filter(value,'colaboradores','nombre_completo')));
  

          if(params_edit){

            this.formAsignarTicket.get('status_seguimiento_id').setValue(params_edit?.status_seguimiento);
            
          }
      },
      error:(error: HttpErrorResponse) => {
        let errorMessage = "Ocurrió un error.";
        if(error.status == 409){
          errorMessage = error.error.message;
        }
          this.alertPanel.showError(errorMessage);
        },
      complete:() =>{}

    });

    this.isLoading = false;
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    if(this.catalogos[catalog]){
      let filterValue = '';
      if(value){
        if(typeof(value) == 'object'){
          filterValue = value[valueField].toLowerCase();
        }else{
          filterValue = value.toLowerCase();
        }
      }
      return this.catalogos[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
    }
  }

  cargarTiposProblema(event){

    this.isLoading = true;
    let areas_atencion = event;

    if(areas_atencion?.option){
      areas_atencion = event.option?.value;
     }else{
      areas_atencion = event;
     }

    const carga_catalogos = [
      {nombre:'tipos_problema',orden:'id', filtro_id:{campo:'area_atencion_id',valor:areas_atencion.id}},
    ];
    this.catalogos['tipos_problema'] = false;
    this.formAsignarTicket.get('tipo_problema_id').reset();

    this.ticketsService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        console.log(response);
        if(response.data['tipos_problema'].length > 0){
          this.catalogos['tipos_problema'] = response.data['tipos_problema'];
        }
        
        this.actualizarValidacionesCatalogos('tipos_problema');
        this.isLoading = false;
      }
    );

  }


  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.formAsignarTicket.get(field_name).value) != 'object') {
        this.formAsignarTicket.get(field_name).reset();
        if(field_name != 'colaborador'){
          this.catalogos['colaboradores'] = false;
          this.actualizarValidacionesCatalogos('colaborador');  
        }
      } 
    }, 300);
  }


  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
      case 'colaborador':
        if(this.catalogos['colaboradores']){
          this.formAsignarTicket.get('colaborador').setValidators(null);
        }else{
          this.formAsignarTicket.get('colaborador').setValidators([Validators.required]);
        }
        this.formAsignarTicket.get('colaborador').updateValueAndValidity();
        break;
      default:
        break;
    }
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }


  ngAfterViewInit(){

    if(this.currentScreenSize == 'sm' || this.currentScreenSize == 'xs'){
      this.resizeDialog();
    }

    this.dataColaboradores.paginator = this.paginator;

  }

  resizeDialog(){
    if(!this.dialogMaxSize){
      this.dialogRef.updateSize('100%', '100%');
      this.dialogMaxSize = true;
    }else{
      this.dialogRef.updateSize('80%','60%');
      this.dialogMaxSize = false;
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  setConfigForm(){
    this.formAsignarTicket.valueChanges.subscribe(
      changes => {
        //console.log(changes);
      }
    );
  }

  changeTextToUppercase(field) {
    const obj = {};
    obj[field] = this.formAsignarTicket.controls[field].value.toUpperCase();
    this.formAsignarTicket.patchValue(obj);
  }

  agregarColaboradores(dataForm: FormGroup){

    dataForm.value.uid = this.nextUid();
    
    this.catalogos['colaboradores'].filter((item, index) => (item?.id === dataForm.value?.colaborador?.id) ? item.isAssigned = true : '');

    (dataForm.value?.seguimiento_id != "" || dataForm.value?.seguimiento_id != null) ? dataForm.value.seguimiento_id = this.seguimiento?.seguimiento_id : null;
    (dataForm.value?.colaborador != ""    || dataForm.value?.colaborador != null) ? dataForm.value.colaborador_id = dataForm.value?.colaborador?.id : null;
    (dataForm.value?.status_seguimiento_id != ""    || dataForm.value?.status_seguimiento_id != null) ? dataForm.value.status_seguimiento_id = 2 : null;

    this.valorColaborador.push(dataForm.value);
    this.dataColaboradores = this.valorColaborador;
    this.dataSourceColaboradores = new MatTableDataSource(this.dataColaboradores);
    const data = this.dataSourceColaboradores.data;

    this.paginator.length = data.length;

    this.dataSourceColaboradores.sort = this.sort;
    this.dataSourceColaboradores.paginator = this.paginator;
    //this.tableColaboradores.renderRows();
    this.dataSourceColaboradores.paginator.lastPage();
    this.formAsignarTicket.reset();

  }

  quitarColaborador(data, index?){

    this.freeAssignedColaborador(data);
    this.dataColaboradores.splice(index, 1);
    this.tableColaboradores.renderRows();
    this.formAsignarTicket.reset();

  }

  editRowColaborador(data){

    this.isEdit = true;
    this.freeAssignedColaborador(data);
    this.formAsignarTicket.patchValue(data);
    
  }

  freeAssignedColaborador(data){

    //checar logica de asignacion
    this.catalogos['colaboradores'].forEach((element, index) => {
      if(element?.id === data?.colaborador?.id){
        this.catalogos['colaboradores'][index].isAssigned = false;
      }
    });

  }

  saveEditColaborador(formAsignarTicket){

    (formAsignarTicket.value?.colaborador != ""   || formAsignarTicket.value?.colaborador != null) ? formAsignarTicket.value.colaborador_id = formAsignarTicket.value?.colaborador?.id : null;

    this.dataColaboradores.forEach((element, index) => {
      if(element?.uid === formAsignarTicket.value?.uid){
        console.log("entro");
        this.dataColaboradores[index] = formAsignarTicket.value;
      }
    });
    
    this.catalogos['colaboradores'].forEach((element, index) => {
      if(element?.id === formAsignarTicket.value?.colaborador?.id){
        this.catalogos['colaboradores'][index].isAssigned = true;
      }
    });
    
    this.tableColaboradores.renderRows();
    this.formAsignarTicket.reset();

    this.isEdit = false;

  }

  asignarTicket(){


    this.isSaving = true;

    if(this.dataColaboradores.length > 0){


      this.ticketsService.asignarTicket(this.dataColaboradores).subscribe({
        next:(response:any)=>{
          this.isSaving = false;
          //this.data.id = response.data.id;
          //this.data.id = response.data.id;
          this.alertPanel.showSuccess('Se asigno el Seguimiento del Ticket con éxito',3);
          this.dialogRef.close(true);
          console.log(response);
  
          this.savedData = true;
        },
        error:( response: HttpErrorResponse )=>{
          if(response.error.error_type == 'form_validation'){
            for (const key in response.error.data) {
              if (Object.prototype.hasOwnProperty.call(response.error.data, key)) {
                const element = response.error.data[key];
                let error:any = {};
                error[element] = true;
                //this.formTicket.get(key).setErrors(error);
              }
            }
            this.alertPanel.showError(response.error.message);
          }else{
            this.alertPanel.showError(response.error.message);
          }
          this.isSaving = false;
        }
      });
    
    
    
    
    }

  }

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(this.savedData);
  }

}
