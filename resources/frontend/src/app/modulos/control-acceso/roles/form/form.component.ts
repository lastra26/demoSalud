import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { RolesService } from '../roles.service';
import { PermissionsService } from '../../permissions/permissions.service';
import { MatTableDataSource } from '@angular/material/table';
import { CustomValidator } from '../../../../utils/classes/custom-validator';
import { Observable, combineLatest, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';

export interface DialogData {
  id?: number;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    public dialogRef: MatDialogRef<FormComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  
  
  isLoading:boolean = false;
  rol:any = {};
  
  catalogPermissions: any[] = [];
  filteredPermissions: Observable<any[]>;
  permissionControl: FormControl;
  selectedPermissions: any[] = [];
  controlSelPermissions: any = {};
  
  catalogos: any = {};
  filteredCatalogs:any = {};

  listaUsuariosIsVisible:boolean;


  rolForm:FormGroup = this.fb.group({
    'id': [''],
    'name': ['',[Validators.required]],
    'permissions': [[],[Validators.required]],
    'nivel_id': [''],
  });

  ngOnInit() {
    this.listaUsuariosIsVisible = false;
    this.isLoading = true;
    this.catalogPermissions = [];
    this.permissionControl = new FormControl();

    this.permissionsService.getAllPermissions().subscribe({
      next:(response:any) => {
        this.catalogPermissions = response.data;
        this.filteredPermissions = this.permissionControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const query = typeof value === 'string' ? value : value?.description;
            return query ? this._filter(query as string) : this.catalogPermissions.slice();
          })
        );

        if(this.data.id){
          this.rolesService.getRole(this.data.id).subscribe({
            next:(response:any) => {
              this.rol = response.data;
              this.selectedPermissions = this.rol.permissions;

              for(let i in this.selectedPermissions){
                this.controlSelPermissions[this.selectedPermissions[i].id] = true;
              }
              this.rol.permissions = Object.keys(this.controlSelPermissions);
              this.rolForm.patchValue(this.rol);
              this.isLoading = false; 
            },
            error:(response:any) => {
              this.alertPanel.showError(response.error.message);
              this.isLoading = false; 
            }
          });
        }else{
          this.isLoading = false; 
        }
      },
      error:(response:any)=>{
        this.alertPanel.showError(response.error.message);
        this.isLoading = false; 
      }
    });
    
  }

  addPermission(event){
    let permission:any = event.option.value;

    if(!this.controlSelPermissions[permission.id]){
      this.selectedPermissions.push(permission);
      this.controlSelPermissions[permission.id] = true;
    }
    
    event.option.deselect();
    this.permissionControl.setValue('');

    this.rolForm.get('permissions').patchValue(Object.keys(this.controlSelPermissions));
  }

  removePermission(index){
    let permission = this.selectedPermissions[index];
    this.selectedPermissions.splice(index,1);
    delete this.controlSelPermissions[permission.id];

    this.rolForm.get('permissions').patchValue(Object.keys(this.controlSelPermissions));
  }
  
  saveRole(){
    if(this.rolForm.valid){
      this.isLoading = true;

      let formData = this.rolForm.value;

      if(this.rol.id){
        this.rolesService.updateRole(this.rol.id,formData).subscribe({
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
        this.rolesService.createRole(formData).subscribe({
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
      }
    }
  }

  confirmDeleteRole(){
    let id:string = this.rol.id;
    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: {title:'Eliminar Rol',message:'Esta seguro de eliminar este rol?',hasOKBtn:true,btnColor:'warn',btnText:'Eliminar',btnIcon:'delete'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.rolesService.deleteRole(id).subscribe(
          response => {
            this.dialogRef.close(true);
          }
        );
      }
    });
  }

  displayFn(value:any): string {
    return '';
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.catalogPermissions.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
