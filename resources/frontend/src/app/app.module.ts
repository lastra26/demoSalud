import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LocationStrategy, HashLocationStrategy} from '@angular/common';

import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { AppsListModule } from './apps-list/apps-list.module';

import { AppRoutingModule } from './app-routing.module';
import { WildcardRoutingModule } from './wildcard-routing.module';

import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './navigation/header/header.component';

import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';

import { SharedService } from './shared/shared.service';
import { TokenInterceptor, ErrorInterceptor } from './token.service';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { DialogEditProfileComponent } from './navigation/dialog-edit-profile/dialog-edit-profile.component';
import { SessionUserMenuComponent } from './navigation/session-user-menu/session-user-menu.component';


//Importacion de modulos
import { DevToolsModule } from './dev-tools/dev-tools.module';
import { ControlAccesoModule } from './modulos/control-acceso/control-acceso.module';
import { TicketsModule } from './modulos/tickets/tickets.module';
import { EquipoInventarioModule } from './modulos/equipos-inventario/equipo-inventario.module'

//Para el Lenguaje de las Fechas
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/es-MX';
registerLocaleData(locale);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    NotFoundComponent,
    ForbiddenComponent,
    DialogEditProfileComponent,
    SessionUserMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
    SharedModule,
    AppsListModule,
    DevToolsModule,
    AppRoutingModule,
    ControlAccesoModule,
    TicketsModule,
    EquipoInventarioModule,
    WildcardRoutingModule,
  ],
  providers: [
    AuthService, 
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    },
    {
      provide: MAT_DATE_LOCALE, 
      useValue: 'es-MX'
    },
    { 
      provide: LOCALE_ID, 
      useValue: 'es-MX'
    },
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
