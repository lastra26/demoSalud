import { Component, Inject, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { startWith, map, filter } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EquipoInventarioService } from '../equipo-inventario.service';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';

//Para checar tamaño de la pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { CustomValidator } from 'src/app/utils/classes/custom-validator';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';

export interface DialogData {
  persona: object;
  tipo_equipo: object;
}

@Component({
  selector: 'app-equipo-inventario',
  templateUrl: './form-equipo-inventario.component.html',
  styleUrls: ['./form-equipo-inventario.component.css']
})
export class FormEquipoInventarioComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tableEquipos', { static: false }) tableEquipos;
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;



  constructor(
    public dialogRef: MatDialogRef<FormEquipoInventarioComponent>,
    @Inject(MAT_DIALOG_DATA) public equipo: DialogData,
    private formBuilder: FormBuilder,
    private equipoInventarioService: EquipoInventarioService,
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

  isEdit:boolean = false;
  isLoading:boolean;
  isSaving:boolean = false;
  dialogMaxSize:boolean;

  isRoot:boolean;

  savedData:boolean;

  formEquipo:FormGroup;
  
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

  pageSize:number = 3;
  filteredEquipos: Observable<any[]>;
  equipoIsLoading: boolean = false;
  displayedColumnsEquipos: string[] = ['no', 'marca', 'no_serie', 'no_inventario', 'tipo_equipo_id', 'es_personal', 'actions'];
  dataSourceEquipos:any = '';
  valorEquipos: any[] = [];

  dataEquipos = Object.assign( this.valorEquipos );

  uid = 0;

  ngOnInit(): void {

    this.savedData = false;
    this.isLoading = true;
    this.dialogRef.addPanelClass('no-padding-dialog');

    this.formEquipo = this.formBuilder.group({

      'id':                 [''],
      'uid':                [''],
      'marca':              ['', Validators.required],
      'modelo':             ['', Validators.required],
      'no_serie':           ['', Validators.required],
      'no_inventario':      [''],        
      'equipo_personal':    [''],
      'tipo_equipo':        [''],          
      'tipo_equipo_id':     [''],
      'persona_id':         ['']

    });



    if(this.equipo){

      this.loadCatalogs(this.equipo);
      this.formEquipo.get('persona_id').patchValue(this.equipo?.persona['sirh_id']);
      this.isLoading = false;

    }else{

      this.setConfigForm();
      this.loadCatalogs(null);
      this.isLoading = false;

    }

    
  }

  public loadCatalogs(params_edit){

    this.isLoading = true;

    const carga_catalogos = [
      {nombre:'tipo_equipo',orden:'id'},
    ];

    this.equipoInventarioService.obtenerCatalogos(carga_catalogos).subscribe({
        
      next:(response) => {
          this.catalogos = response.data;
          console.log(this.catalogos);

          this.filteredCatalogs['tipo_equipo']          = this.formEquipo.controls['tipo_equipo'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'tipo_equipo','descripcion')));

          if(params_edit){
            this.formEquipo.get('tipo_equipo').setValue(params_edit?.tipo_equipo);
          }

          console.log(this.formEquipo.value);
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

  es_personal(event:MatCheckboxChange): void{

    console.log(event.checked);
    console.log(this.formEquipo.value);

  }

  private nextUid() {
    ++this.uid
    return this.uid;
  }

  agregarEquipos(dataForm: FormGroup){


    dataForm.value.uid = this.nextUid();

    (dataForm.value?.tipo_equipo != ""    || dataForm.value?.tipo_equipo != null) ? dataForm.value.tipo_equipo_id = dataForm.value?.tipo_equipo?.id : null;

    this.valorEquipos.push(dataForm.value);
    this.dataEquipos = this.valorEquipos;
    this.dataSourceEquipos = new MatTableDataSource<Element>(this.dataEquipos);
    const data = this.dataSourceEquipos.data;

    this.paginator.length = data.length;

    this.dataSourceEquipos.paginator = this.paginator;
    this.dataSourceEquipos.paginator.lastPage();
    //this.tableEquipos.renderRows();

    this.formEquipo.reset();

  }

  quitarEquipo(item?, index?){

  }

  editRowEquipo(datos?){

  }

  saveEditEquipo(dataForm?){

  }


  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.formEquipo.get(field_name).value) != 'object') {
        this.formEquipo.get(field_name).reset();
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
          this.formEquipo.get('cr_id').setValidators(null);
        }else{
          this.formEquipo.get('cr_id').setValidators([Validators.required]);
        }
        this.formEquipo.get('cr_id').updateValueAndValidity();
        break;
      case 'personas':
        if(this.catalogos['personas']){
          this.formEquipo.get('persona_id').setValidators(null);
        }else{
          this.formEquipo.get('persona_id').setValidators([Validators.required]);
        }
        this.formEquipo.get('persona_id').updateValueAndValidity();
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
    this.dataEquipos.paginator = this.paginator;
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
    this.formEquipo.valueChanges.subscribe(
      changes => {
        console.log(changes);
      }
    );
  }

  guardarTicket(){
    this.alertPanel.closePanel();
    if(this.formEquipo.valid){
      this.isSaving = true;

      let valueForm:any = {
        equipo: this.formEquipo.value,
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

      // if(this.ticket.id){

      //   this.ticketsService.actualizarTicket(this.ticket.id, valueForm).subscribe({
      //     next:(response:any) =>{
      //       this.dialogRef.close(true);
      //       console.log(response);
      //       this.isLoading = false;
      //     },
      //     error:(response:any) => {
      //       this.alertPanel.showError(response.error.message);
      //       this.isLoading = false;
      //     }
      // });

      // }else{

      //   this.ticketsService.guardarTicket(valueForm).subscribe({
      //     next:(response:any)=>{
      //       this.isSaving = false;
      //       //this.data.id = response.data.id;
      //       //this.data.id = response.data.id;
      //       this.formEquipo.get('id').patchValue(response.data?.id);
      //       this.alertPanel.showSuccess('Datos guardados con éxito',3);
      //       this.dialogRef.close(true);
      //       console.log(response);
  
      //       this.savedData = true;
      //     },
      //     error:( response: HttpErrorResponse )=>{
      //       if(response.error.error_type == 'form_validation'){
      //         for (const key in response.error.data) {
      //           if (Object.prototype.hasOwnProperty.call(response.error.data, key)) {
      //             const element = response.error.data[key];
      //             let error:any = {};
      //             error[element] = true;
      //             this.formEquipo.get(key).setErrors(error);
      //           }
      //         }
      //         this.alertPanel.showError(response.error.message);
      //       }else{
      //         this.alertPanel.showError(response.error.message);
      //       }
      //       this.isSaving = false;
      //     }
      //   });

      // }


    }
  }

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(this.savedData);
  }

}
