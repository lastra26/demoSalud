import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'tab-permissions',
  templateUrl: './tab-permissions.component.html',
  styleUrls: ['./tab-permissions.component.css']
})
export class TabPermissionsComponent implements OnInit {
  @Output() changeDetected = new EventEmitter<boolean>();

  constructor() {}

  catalogPermissions: any[];
  filteredPermissions: Observable<any[]>;
  permissionControl: FormControl;
  selectedPermissions: any[];
  ctrlSelPermissions: any;

  ngOnInit() {
    this.catalogPermissions = [];
    this.permissionControl = new FormControl();
    this.selectedPermissions = [];
    this.ctrlSelPermissions = {};
  }

  public initCatalogPermisssions(permissions?:any[]){
    if(permissions){
        this.catalogPermissions = permissions;
    }
    this.filteredPermissions = this.permissionControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const query = typeof value === 'string' ? value : value?.description;
          return query ? this._filter(query as string) : this.catalogPermissions.slice();
        })
    );
  }

  public insertRolePermissions(role:any){
    role.permissions.forEach(permission => {
        this.addPermission(permission, role.id);
    });
  }

  public removeRolePermissions(role:any){
    role.permissions.forEach(permission => {
      if(this.ctrlSelPermissions[permission.id]){
        let index_role = this.ctrlSelPermissions[permission.id].roles.findIndex(x => x == role.id);
        if(index_role >= 0){
          this.ctrlSelPermissions[permission.id].roles.splice(index_role,1);
        }
        if(this.ctrlSelPermissions[permission.id].roles.length == 0){
          let index_permission = this.selectedPermissions.findIndex(x => x.id == permission.id);
          if(index_permission >= 0){
            this.removePermission(index_permission);
          }
        }
      }
    });
  }

  public loadPermissions(permissions:any[]){
    this.selectedPermissions = [];
    this.ctrlSelPermissions = {};
    permissions.forEach(permission => {
      this.addPermission(permission);
    });
  }

  public getSelectedPermissions(){
    return this.ctrlSelPermissions;
}

  toggleActivePermission(id:string,event:any){
    this.ctrlSelPermissions[id].active = event.checked;
    this.changeDetected.emit(true);
  }

  addPermissionEvent(event:any){
    let permission:any = event.option.value;
    this.addPermission(permission);
    event.option.deselect();
    this.permissionControl.setValue('');
  }

  addPermission(permission:any, role_id?:number){
    if(!this.ctrlSelPermissions[permission.id]){
      this.selectedPermissions.push(permission);
      let active:boolean = true;

      if(permission.pivot && permission.pivot.user_id){ //Si el permiso ya fue asignado al usuario trae un pivote con el user_id
        active = (permission.pivot.status == 1);
      }

      this.ctrlSelPermissions[permission.id] = {roles:[], active: active};
      this.changeDetected.emit(true);
    }
    
    if(role_id){
        let index = this.ctrlSelPermissions[permission.id].roles.findIndex(x => x == role_id);
        if(index < 0){
            this.ctrlSelPermissions[permission.id].roles.push(role_id);
        }
    }
  }

  removePermission(index:number){
    let permission = this.selectedPermissions[index];
    if(permission){
      this.selectedPermissions.splice(index,1);
      delete this.ctrlSelPermissions[permission.id];
      this.changeDetected.emit(true);
    }
  }

  displayFn(value:any): string {
    return '';
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.catalogPermissions.filter(option => option.description.toLowerCase().includes(filterValue));
  }
}