import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { RolesRoutingModule } from './roles-routing.module';
import { ListComponent } from './list/list.component';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { FormComponent } from './form/form.component';

@NgModule({
    declarations: [ListComponent, FormComponent],
    imports: [
        CommonModule,
        SharedModule,
        RolesRoutingModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    ]
})
export class RolesModule { }
