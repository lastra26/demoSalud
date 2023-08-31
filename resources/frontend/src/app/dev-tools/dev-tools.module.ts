import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevToolsRoutingModule } from './dev-tools-routing.module';
import { ReporterModule } from './reporter/reporter.module';
import { SysLogErrorsModule } from './sys-log-errors/sys-log-errors.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DevToolsRoutingModule
  ],
  exports:[
    ReporterModule,
    SysLogErrorsModule
  ]
})
export class DevToolsModule { }
