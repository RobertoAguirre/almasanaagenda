import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { getLocaleMonthNames } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public token;
  public id;
  public loginForm;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private appComponent: AppComponent

  ) {
    this.loginForm = new FormGroup({
      usuario: new FormControl,
      pass: new FormControl
    })
    this.isLoggedIn();
  }

  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    // Lógica para verificar si el usuario ha iniciado sesión, por ejemplo, utilizando un servicio de autenticación
    return this.authService.isLoggedIn();
  }

  autentificar(email,pass) {


    let data = {
      "appname": this.apiService.server(),
      "params": {
        "usuario": email.value,
        "contrasena": pass.value
      }
    }



    this.apiService.autentifica(data).subscribe((response) => {
      let _response;
      _response = response;
      localStorage.setItem('id', _response.id);

      if (_response.acceso !== true) {
        this.appComponent.SwalModals('',_response.mensaje, _response.icono);
      } else {
        this.token = _response.token;
        this.id = _response.id;
        this.authService.setToken(this.token);
        let tkn = this.authService.getToken();
        //alert(tkn);


        localStorage.setItem('tkn', this.token);
        localStorage.setItem('id', this.id);
        localStorage.setItem('seguridad', _response.nivel_seguridad);
        localStorage.setItem('user', _response.usuario);
        this.id = localStorage.getItem('id');
        //this.appComponent.ShowMenu();
        //this.appComponent.GeneraMenu();
        //this.appComponent.GeneraMenu();
        this.router.navigate(['home']); // tells them they've been logged out (somehow)

      }

    })

  }

}
