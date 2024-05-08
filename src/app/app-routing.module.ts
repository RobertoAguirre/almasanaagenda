import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AuthService } from '../app/services/auth.service';
import { TerapeutasComponent } from './catalogos/terapeutas/terapeutas.component';
import { UsuariosComponent } from './catalogos/usuarios/usuarios.component';
import { LoginComponent } from './login/login/login.component';
import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RolesComponent } from './catalogos/usuarios/roles/roles.component';
import { CursosComponent } from './catalogos/cursos/cursos.component';
import { AgendaComponent } from './agenda/agenda.component';


const routes: Routes = [
  { path:'',component:AgendaComponent,pathMatch:"full"},
  //{ path: '', component: LoginComponent, pathMatch: "full" },
  { path: 'home', component: HomeComponent, pathMatch: "full" },
  { path: 'terapeutas', component: TerapeutasComponent, pathMatch: "full" },
  { path: 'usuarios', component: UsuariosComponent, pathMatch: "full" },
  { path: 'roles', component: RolesComponent, pathMatch: "full" },
  { path: 'reset-password', component: ResetPasswordComponent, pathMatch:"full"},
  { path: 'cursos', component: CursosComponent, pathMatch:"full"},
  { path:'agenda',component:AgendaComponent,pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledNonBlocking' 

  })],
  exports: [RouterModule],
  providers: [AuthService]
})
export class AppRoutingModule { }
