import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

import { FullCalendarModule } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid'; // Importa el plugin dayGrid

import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TerapeutasComponent } from './catalogos/terapeutas/terapeutas.component';
import { UsuariosComponent } from './catalogos/usuarios/usuarios.component';
import { LoginComponent } from './login/login/login.component';
import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RolesComponent } from './catalogos/usuarios/roles/roles.component';
import { CursosComponent } from './catalogos/cursos/cursos.component';
import { AgendaComponent } from './agenda/agenda.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TerapeutasComponent,
    UsuariosComponent,
    LoginComponent,
    HomeComponent,
    ResetPasswordComponent,
    RolesComponent,
    CursosComponent,
    AgendaComponent,

  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
