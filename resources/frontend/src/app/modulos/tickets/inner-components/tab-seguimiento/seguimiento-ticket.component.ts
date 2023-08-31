import { Component, Inject, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { startWith, map } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';

import { TicketsService } from '../../tickets.service';

@Component({
  selector: 'tab-seguimiento-ticket',
  templateUrl: './seguimiento-ticket.component.html',
  styleUrls: ['./seguimiento-ticket.component.css']
})
export class TabSegumientoComponent implements OnInit, OnDestroy {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  
  @Output() public onFormGroupSeguimiento = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<TabSegumientoComponent>,
    private ticketsService: TicketsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {}


  isLoading:boolean;
  isSaving:boolean = false;
  dialogMaxSize:boolean;

  formSeguimiento:FormGroup;

  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;

  filterCatalogs:any = {};
  filteredCatalogs:any = {};
  catalogos: any = {};
  datos:any

  ngOnInit(): void {

    this.isLoading = true;
    this.dialogRef.addPanelClass('no-padding-dialog');


    this.formSeguimiento = new FormGroup({
      id                      : new FormControl(''),
      ticket_id               : new FormControl(''),
      status_seguimiento_id   : new FormControl(''),
      area_atencion_id        : new FormControl(''),
      tipo_problema_id        : new FormControl(''),
      tipo_equipo_id          : new FormControl(''),
      descripcion_problema    : new FormControl('', Validators.required),
      observaciones_problema  : new FormControl('', Validators.required)
    });

    this.initCatalogSeguimiento(null);

    this.onFormGroupSeguimiento.emit(this.formSeguimiento);


  }

  public updateSeguimiento(id:number){

    if(id){
      this.ticketsService.verSeguimiento(id).subscribe({
        next: (response:any)=>{
          console.log("seguimiento",response?.data);
          this.formSeguimiento.get('id').patchValue(response?.data?.id);
          this.formSeguimiento.get('ticket_id').patchValue(response?.data?.ticket_id);
          this.formSeguimiento.get('descripcion_problema').patchValue(response?.data?.descripcion_problema);
          this.formSeguimiento.get('observaciones_problema').patchValue(response?.data?.observaciones_problema);
          this.datos = response?.data;
          this.initCatalogSeguimiento(response?.data);
          this.formSeguimiento.markAllAsTouched();
          this.isLoading = false;
        },
        error: (response:any)=>{
          this.alertPanel.showError(response.error.message);
          this.isLoading = false;
        }
      });
    }else{
      this.setConfigForm();
      this.initCatalogSeguimiento(null);
      this.isLoading = false;
    }

  }



  public initCatalogSeguimiento(params_edit){

    this.isLoading = true;

    const carga_catalogos = [
      {nombre:'areas_atencion',orden:'id'},
      {nombre:'tipo_equipo',orden:'id'},
      {nombre:'status_seguimiento',orden:'id'},
    ];

    this.ticketsService.obtenerCatalogos(carga_catalogos).subscribe({
        
      next:(response) => {
          this.catalogos = response.data;
          console.log("seguimiento",this.catalogos);

          this.filteredCatalogs['status_seguimiento']   = this.formSeguimiento.controls['status_seguimiento_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'status_seguimiento','descripcion')));
          this.filteredCatalogs['areas_atencion']       = this.formSeguimiento.controls['area_atencion_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'areas_atencion','descripcion')));
          this.filteredCatalogs['tipos_problema']       = this.formSeguimiento.controls['tipo_problema_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'tipos_problema','descripcion')));
          this.filteredCatalogs['tipo_equipo']          = this.formSeguimiento.controls['tipo_equipo_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'tipo_equipo','descripcion')));
          

          if(params_edit){

            this.formSeguimiento.get('status_seguimiento_id').setValue(params_edit?.status_seguimiento);
            this.formSeguimiento.get('tipo_equipo_id').setValue(params_edit?.tipo_equipo);
            this.formSeguimiento.get('area_atencion_id').setValue(params_edit?.area_atencion);
            this.cargarTiposProblema(params_edit?.area_atencion);
            this.formSeguimiento.get('tipo_problema_id').setValue(params_edit?.tipo_problema);
            
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
    this.formSeguimiento.get('tipo_problema_id').reset();

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
      if (typeof(this.formSeguimiento.get(field_name).value) != 'object') {
        this.formSeguimiento.get(field_name).reset();
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
          this.formSeguimiento.get('tipo_problema_id').setValidators(null);
        }else{
          this.formSeguimiento.get('tipo_problema_id').setValidators([Validators.required]);
        }
        this.formSeguimiento.get('tipo_problema_id').updateValueAndValidity();
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

  ngOnDestroy() {

  }

  setConfigForm(){
    this.formSeguimiento.valueChanges.subscribe(
      changes => {
        console.log(changes);
      }
    );
  }

}
