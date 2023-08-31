import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'tab-roles',
  templateUrl: './tab-roles.component.html',
  styleUrls: ['./tab-roles.component.css']
})
export class TabRolesComponent implements OnInit {
    @Output() roleSelected = new EventEmitter<any>();
    @Output() roleRemoved = new EventEmitter<any>();
    @Output() changeDetected = new EventEmitter<boolean>();

    constructor() {}

    catalogRoles: any[];
    filteredRoles: Observable<any[]>;
    roleControl: FormControl;
    selectedRoles: any[];
    controlSelRoles: any;

    ngOnInit() {
        this.catalogRoles = [];
        this.roleControl = new FormControl();
        this.selectedRoles = [];
        this.controlSelRoles = {};
    }

    public initCatalogRoles(roles?:any[]){
        if(roles){
            this.catalogRoles = roles;
        }
        this.filteredRoles = this.roleControl.valueChanges.pipe(
            startWith(''),
            map(value => {
            const query = typeof value === 'string' ? value : value?.name;
            return query ? this._filter(query as string) : this.catalogRoles.slice();
            })
        );
    }

    public loadRoles(roles:any[]){
        roles.forEach(role => {
            this.addRole(role);
        });
    }

    public getSelectedRolesIds(){
        return Object.keys(this.controlSelRoles);
    }

    protected addRoleEvent(event:any){
        let role:any = event.option.value;

        this.addRole(role);

        event.option.deselect();
        this.roleControl.setValue('');

        this.roleSelected.emit(role);
    }

    private addRole(role){
        if(!this.controlSelRoles[role.id]){
            this.selectedRoles.push(role);
            this.controlSelRoles[role.id] = true;
            this.changeDetected.emit(true);
        }
    }

    removeRole(index){
        let role = this.selectedRoles[index];
        if(role){
            this.selectedRoles.splice(index,1);
            delete this.controlSelRoles[role.id];
            this.roleRemoved.emit(role);
            this.changeDetected.emit(true);
        }
    }

    displayFn(value:any): string {
        return '';
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.catalogRoles.filter(option => option.name.toLowerCase().includes(filterValue));
    }
}