import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { startWith, map, filter } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketsService } from '../tickets.service';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';

//Para checar tamaño de la pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { CustomValidator } from 'src/app/utils/classes/custom-validator';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { TabSegumientoComponent } from '../inner-components/tab-seguimiento/seguimiento-ticket.component';
// import { TabPermissionsComponent } from '../inner-components/tab-permissions/tab-permissions.component';
// import { TabRolesComponent } from '../inner-components/tab-roles/tab-roles.component';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-form-ticket',
  templateUrl: './form-ticket.component.html',
  styleUrls: ['./form-ticket.component.css']
})
export class FormTicketsComponent implements OnInit, OnDestroy {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  @ViewChild(TabSegumientoComponent) tabSeguimiento: TabSegumientoComponent;
  // @ViewChild(TabRolesComponent) tabRoles: TabRolesComponent;



  constructor(
    public dialogRef: MatDialogRef<FormTicketsComponent>,
    @Inject(MAT_DIALOG_DATA) public ticket: DialogData,
    private formBuilder: FormBuilder,
    private ticketsService: TicketsService,
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

  isRoot:boolean;

  savedData:boolean;

  formTicket:FormGroup;
  
  avatarsList: any[];
  selectedAvatar:string;
  avatarRowCount:number;

  statusUser:number;
  //statusDesc:any = USER_STATUS_CATALOG;

  lastLogin:any;

  fechaActual:Date = new Date();
  maxDate:Date;
  minDate:Date;

  filterCatalogs:any = {};
  filteredCatalogs:any = {};
  catalogos: any = {};
  datos:any;
  formSegumientoCheck :any  = '';

  cluesInit = {
    clues:{
      clues:"CSSSA017213",
      distrito_id: 11,
      estatus: "EN OPERACION",
      nivel_atencion:"NO APLICA",
      nombre_unidad:"OFICINA ADMINISTRATIVA ESTATAL"
    }
  }

  ngOnInit(): void {

    this.savedData = false;
    this.isLoading = true;
    this.dialogRef.addPanelClass('no-padding-dialog');

    this.formTicket = this.formBuilder.group({

      'id':               [''],
      'fecha_ticket':     ['',Validators.required],
      'nombre_persona':   [''],
      'persona_id':       [''],
      'status_ticket_id': [1],
      'clues_id':         [''],
      'cr_id':            [''],
      'user_id':          ['']
    });



    if(this.ticket?.id){
      this.ticketsService.verTicket(this.ticket.id).subscribe({
        next: (response:any)=>{
          let fecha_ticket = new Date(response?.data?.fecha_ticket);
          this.formTicket.patchValue(response?.data);
          this.formTicket.get('fecha_ticket').patchValue(fecha_ticket);
          this.datos = response?.data;
          this.loadCatalogs(response?.data);
          this.formTicket.markAllAsTouched();
          this.tabSeguimiento.updateSeguimiento(this.ticket?.id);

          
          this.isLoading = false;
        },
        error: (response:any)=>{
          this.alertPanel.showError(response.error.message);
          this.isLoading = false;
        }
      });
    }else{
      this.setConfigForm();
      console.log("aca", this.cluesInit);
      this.loadCatalogs(this.cluesInit);
      this.isLoading = false;
    }

    this.dateBeginning();

    
    
  }

  public onFormGroupSeguimientoChangeEvent(_event) {
    this.formSegumientoCheck = _event;
    console.log("output",this.formSegumientoCheck.value);
  }

  public loadCatalogs(params_edit){

    this.isLoading = true;

    const carga_catalogos = [
      {nombre:'clues',orden:'nombre_unidad'},
    ];

    this.ticketsService.obtenerCatalogos(carga_catalogos).subscribe({
        
      next:(response) => {
          this.catalogos = response.data;
          console.log(this.catalogos);

          this.filteredCatalogs['clues']          = this.formTicket.controls['clues_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'clues','nombre_unidad')));
          this.filteredCatalogs['cr']             = this.formTicket.controls['cr_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'cr','descripcion')));
          this.filteredCatalogs['personas']       = this.formTicket.controls['persona_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'personas','nombre')));

          if(params_edit){

            this.formTicket.get('clues_id').setValue(params_edit?.clues);
            this.cargarCrs(params_edit?.clues);
            this.formTicket.get('cr_id').setValue(params_edit?.cr);

            (params_edit?.persona != null) ? this.cargarPersonal(params_edit?.cr) : null;
            
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

  cargarCrs(event){

    this.isLoading = true;
    let clues = event;

    if(clues?.option){
      clues = event.option?.value;
     }else{
      clues = event;
     }

    const carga_catalogos = [
      {nombre:'cr',orden:'descripcion', filtro_id:{campo:'clues',valor:clues?.clues}},
    ];
    this.catalogos['cr'] = false;
    this.formTicket.get('cr_id').reset();

    this.ticketsService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['cr'].length > 0){
          this.catalogos['cr'] = response.data['cr'];
        }
        
        this.actualizarValidacionesCatalogos('cr');
        this.isLoading = false;
      }
    );

  }

  cargarPersonal(event){

    this.isLoading = true;

    let cr = event;

    if(cr?.option){
      cr = event.option?.value;
     }else{
      cr = event;
     }

    const carga_catalogos = [
      {nombre:'personas', filtro_id:{campo:'cr_id',valor:cr.cr}},
    ];
    this.catalogos['personas'] = false;
    this.formTicket.get('persona_id').reset();

    this.ticketsService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['personas'].length > 0){

          const format = response.data['personas'].map( (item) => {
            item.nombre =  `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`
            return item;
          });

          this.catalogos['personas'] = format;

          if(this.ticket?.id){

            const result = this.catalogos['personas'].find(element => element.sirh_id === this.datos?.persona_id );
            this.formTicket.get('persona_id').patchValue(result);

          }

        }
        
        this.actualizarValidacionesCatalogos('personas');
        this.isLoading = false;
      }
    );

  }

  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.formTicket.get(field_name).value) != 'object') {
        this.formTicket.get(field_name).reset();
        if(field_name != 'cr_id'){
          this.catalogos['cr'] = false;
          this.actualizarValidacionesCatalogos('cr');  
        }
        // else if(field_name != 'persona_id'){
        //   this.catalogos['personas'] = false;
        //   this.actualizarValidacionesCatalogos('personas');  
        // }
      } 
    }, 300);
  }

  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
      case 'cr':
        if(this.catalogos['cr']){
          this.formTicket.get('cr_id').setValidators(null);
        }else{
          this.formTicket.get('cr_id').setValidators([Validators.required]);
        }
        this.formTicket.get('cr_id').updateValueAndValidity();
        break;
      case 'personas':
        if(this.catalogos['personas']){
          this.formTicket.get('persona_id').setValidators(null);
        }else{
          this.formTicket.get('persona_id').setValidators([Validators.required]);
        }
        this.formTicket.get('persona_id').updateValueAndValidity();
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

  dateBeginning(){
    this.maxDate = this.fechaActual;
    this.formTicket.get('fecha_ticket').patchValue(this.maxDate);
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
    this.formTicket.valueChanges.subscribe(
      changes => {
        console.log(changes);
      }
    );
  }

  guardarTicket(){
    this.alertPanel.closePanel();
    if(this.formTicket.valid && this.formSegumientoCheck.valid){
      this.isSaving = true;

      let valueForm:any = {
        ticket: this.formTicket.value,
        seguimiento: this.formSegumientoCheck.value
      };

      //Ticket
      if( typeof valueForm.ticket?.persona_id === 'object' ){
        valueForm.ticket.persona_id = valueForm.ticket.persona_id?.sirh_id
        valueForm.ticket.nombre_persona = '';
      }else{
        valueForm.ticket.nombre_persona = valueForm.ticket?.persona_id;
        valueForm.ticket.persona_id = '';
      }
      if(valueForm.ticket?.clues_id){
        valueForm.ticket.clues_id = valueForm.ticket.clues_id?.clues
      }
      if(valueForm.ticket?.cr_id){
        valueForm.ticket.cr_id = valueForm.ticket.cr_id?.cr
      }

      //seguimiento
      if(valueForm.seguimiento?.status_seguimiento_id){
        valueForm.seguimiento.status_seguimiento_id = valueForm.seguimiento.status_seguimiento_id?.id
      }
      if(valueForm.seguimiento?.area_atencion_id){
        valueForm.seguimiento.area_atencion_id = valueForm.seguimiento.area_atencion_id?.id
      }
      if(valueForm.seguimiento?.tipo_problema_id){
        valueForm.seguimiento.tipo_problema_id = valueForm.seguimiento.tipo_problema_id?.id
      }
      if(valueForm.seguimiento?.tipo_equipo_id){
        valueForm.seguimiento.tipo_equipo_id = valueForm.seguimiento.tipo_equipo_id?.id
      }

      if(this.ticket.id){

        this.ticketsService.actualizarTicket(this.ticket.id, valueForm).subscribe({
          next:(response:any) =>{
            this.dialogRef.close(true);
            console.log(response);
            this.isLoading = false;
          },
          error:(response:any) => {
            this.alertPanel.showError(response.error.message);
            this.isLoading = false;
          }
      });

      }else{

        this.ticketsService.guardarTicket(valueForm).subscribe({
          next:(response:any)=>{
            this.isSaving = false;
            //this.data.id = response.data.id;
            //this.data.id = response.data.id;
            this.formTicket.get('id').patchValue(response.data?.id);
            this.alertPanel.showSuccess('Datos guardados con éxito',3);
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
                  this.formTicket.get(key).setErrors(error);
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
  }

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(this.savedData);
  }

}
