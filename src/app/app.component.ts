import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from './services/api.service';
import { isPlatformBrowser } from '@angular/common';
//import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { AuthService } from './services/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2'; 

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'almaSana';

  blankUrl = '';
  currentUrl: string;
  checkoutUrls = ['/login'];

  public id;
  public gruposLogin;
  public menus;
  public MODULOSPORGRUPO = [];
  public grupoModulos;
  public modulos;

  constructor(
    public apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.id = localStorage.getItem('id');

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      /* console.log(this.activatedRoute.root);
      alert("navigating" + this.activatedRoute.root); */
    });


    /*     this.activatedRoute.url.subscribe(url => {
          console.log(url);
    
        }); */


  }
  
  ngOnInit(): void {
    console.log('app');
  }

  isLoggedIn(): boolean {
    // Lógica para verificar si el usuario ha iniciado sesión, por ejemplo, utilizando un servicio de autenticación
    return this.authService.isLoggedIn();
  }

  showSpinner() {
    document.getElementById("spinner-back").classList.add("show");
    document.getElementById("spinner-front").classList.add("show");
  }
  hideSpinner() {
    document.getElementById("spinner-back").classList.remove("show");
    document.getElementById("spinner-front").classList.remove("show");
  }

  Filtrar(nombre_grupo) {

    return this.modulos.filter(function (item) { return (item.nombre_grupo == nombre_grupo); });
  }

  GeneraMenu() {

    this.id = localStorage.getItem('id');
    
    if (this.MODULOSPORGRUPO.length <= 0) {

      let data = {
        "appname": this.apiService.server(),
        "sp": "Trae_Modulos_Web_Usuario",
        "params": [parseInt(this.id)]

      }

      this.apiService.ejecuta(data).subscribe((response) => {
        let _response;
        _response = response;


        this.menus = _response.success.recordsets[1];
        this.modulos = _response.success.recordsets[0];

        this.menus.forEach(value => {
          this.grupoModulos = {
            'idgrupo': value.id_grupo,
            'nombre_grupo': value.nombre_grupo,
            'icono_grupo': value.icono,
            'modulos': []
          }

          this.modulos = _response.success.recordsets[0];
          this.modulos = this.Filtrar(value.nombre_grupo);

          this.modulos.forEach(value => {
            this.grupoModulos['modulos'].push(value);
          })

          this.MODULOSPORGRUPO.push(this.grupoModulos);
          

        })

       

      })
      console.log( this.MODULOSPORGRUPO)
    }

  }

  SwalModals(title, message, type){
    Swal.fire(title, message, type)
  }

  SwalModalHTML(title, message, type){
    var _html ='';
    _html = _html + '<p><b>'+ title + '</b></p>'
    message.forEach(value => {
      
      _html = _html + '<li style="text-align:left">'+ value + '</li>'
    })
    Swal.fire({
      icon: type,
      //title: title,
      html:_html
      /* '<li>Elemento 1</li>' +
      '<li>Elemento 1</li>', */
      
    })
  }

}
