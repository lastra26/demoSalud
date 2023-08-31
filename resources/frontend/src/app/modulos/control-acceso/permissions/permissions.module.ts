import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { ListComponent } from './list/list.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { FormComponent } from './form/form.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    declarations: [ListComponent, FormComponent],
    imports: [
        CommonModule,
        SharedModule,
        PermissionsRoutingModule,
    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    ]
})
export class PermissionsModule { }
