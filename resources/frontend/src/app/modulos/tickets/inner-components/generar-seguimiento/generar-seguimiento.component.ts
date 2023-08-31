import { Component, Inject, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { startWith, map } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';

import { TicketsService } from '../../tickets.service';

//Para checar tamaño de la pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


export interface DialogData {
  id: number;
}

@Component({
  selector: 'generar-seguimiento',
  templateUrl: './generar-seguimiento.component.html',
  styleUrls: ['./generar-seguimiento.component.css']
})
export class FormGenerarSeguimientoComponent implements OnInit, OnDestroy {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  
  //@Output() public onFormGroupSeguimiento = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<FormGenerarSeguimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public seguimiento: DialogData,
    private ticketsService: TicketsService,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
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


  isLoading:boolean;
  isSaving:boolean = false;
  dialogMaxSize:boolean;

  formGenerarSeguimiento:FormGroup;

  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;

  filterCatalogs:any = {};
  filteredCatalogs:any = {};
  catalogos: any = {};
  datos:any
  savedData:boolean;

  ngOnInit(): void {

    this.isLoading = true;
    this.dialogRef.addPanelClass('no-padding-dialog');

    this.formGenerarSeguimiento = this.formBuilder.group({

      'id':                         [''],
      'ticket_id':                  [''],
      'status_seguimiento_id':      [''],
      'area_atencion_id':           [''],
      'tipo_problema_id':           [''],
      'tipo_equipo_id':             [''],
      'descripcion_problema':       [''],
      'observaciones_problema':     [''],

    });

    this.initCatalogs(null);

    //this.onFormGroupSeguimiento.emit(this.formGenerarSeguimiento);

    console.log("id seguimiento", this.seguimiento.id);


  }

  fechas: any = {accion:false, rango_fechas:{inicio:null, fin:null}};

  public updateSeguimiento(id:number){

    if(id){
      this.ticketsService.verSeguimiento(id).subscribe({
        next: (response:any)=>{
          this.isLoading = false;
          console.log("seguimiento",response?.data);
          this.formGenerarSeguimiento.patchValue(response?.data);
          this.datos = response?.data;
          this.initCatalogs(response?.data);
          this.formGenerarSeguimiento.markAllAsTouched();
        },
        error: (response:any)=>{
          this.alertPanel.showError(response.error.message);
          this.isLoading = false;
        }
      });
    }else{
      this.setConfigForm();
      this.initCatalogs(null);
      this.isLoading = false;
    }

  }


  public initCatalogs(params_edit){

    this.isLoading = true;

    const carga_catalogos = [
      {nombre:'status_seguimiento',orden:'id'},
      
    ];

    this.ticketsService.obtenerCatalogos(carga_catalogos).subscribe({
        
      next:(response) => {
          this.catalogos = response.data;
          console.log("catalogos",this.catalogos);

          this.filteredCatalogs['status_seguimiento']   = this.formGenerarSeguimiento.controls['status_seguimiento_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'status_seguimiento','descripcion')));

          this.filteredCatalogs['areas_atencion']       = this.formGenerarSeguimiento.controls['area_atencion_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'areas_atencion','descripcion')));
          this.filteredCatalogs['tipos_problema']       = this.formGenerarSeguimiento.controls['tipo_problema_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'tipos_problema','descripcion')));
          this.filteredCatalogs['tipo_equipo']          = this.formGenerarSeguimiento.controls['tipo_equipo_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'tipo_equipo','descripcion')));
          

          if(params_edit){

            this.formGenerarSeguimiento.get('status_seguimiento_id').setValue(params_edit?.status_seguimiento);
            
          }

          this.isLoading = false;
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
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
   console.log(this.catalogos[catalog]);
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
    this.formGenerarSeguimiento.get('tipo_problema_id').reset();

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
      if (typeof(this.formGenerarSeguimiento.get(field_name).value) != 'object') {
        this.formGenerarSeguimiento.get(field_name).reset();
        if(field_name != 'tipo_problema_id'){
          this.catalogos['tipos_problema'] = false;
          this.actualizarValidacionesCatalogos('tipo_problema');  
        }
      } 
    }, 300);
  }


  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
      case 'tipo_problema':
        if(this.catalogos['tipos_problema']){
          this.formGenerarSeguimiento.get('tipo_problema_id').setValidators(null);
        }else{
          this.formGenerarSeguimiento.get('tipo_problema_id').setValidators([Validators.required]);
        }
        this.formGenerarSeguimiento.get('tipo_problema_id').updateValueAndValidity();
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
    this.formGenerarSeguimiento.valueChanges.subscribe(
      changes => {
        console.log(changes);
      }
    );
  }

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(this.savedData);
  }

  guardarSeguimiento(){

  }

}
