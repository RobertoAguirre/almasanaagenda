import { Component, OnInit, OnDestroy, Renderer2,HostListener  } from '@angular/core';
import { AppComponent } from '../app.component';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ElementRef } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  entro = 0;
  isCollapsed = true;
  //isCollapsed: boolean[] = [];
  offcanvasOpened = false;
  listenerRegistered = false;
  expandedIndex: number = -1;
  menuItems: string[] = ['Action', 'Another action', 'Yet another action'];
  //collapsedItemIndices: Set<number> = new Set<number>();
  collapsedItemIndices = new Set<number>();
  public id;
  public gruposLogin;
  public menus;
  public MODULOSPORGRUPO = [];
  public grupoModulos;
  public modulos;

  constructor(
    private apiService: ApiService,
    public router:Router,
    public authService:AuthService,
    private appComponent: AppComponent,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { 

    // this.renderer.listen('window', 'shown.bs.offcanvas', () => {
    //   if (!this.offcanvasOpened) {
    //     console.log('Offcanvas abierto');
    //     // Realizar acciones adicionales si es necesario
    //     this.offcanvasOpened = true;
       
    //   }
    // });
    //this.isCollapsed = new Array(this.MODULOSPORGRUPO.length).fill(true);
  }

  

/*   @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    const offcanvasElement = document.getElementById('offcanvasNavbar');
    if (!(offcanvasElement as HTMLElement).contains(event.target as Node)) {
      // Llamar a la función que deseas ejecutar cuando se hace clic fuera del offcanvas
      console.log('fuera');
      if(this.offcanvasOpened === true){
        this.offcanvasOpened = false;
      }
      
    }
  } */

  isOpen = false;



  toggleMenu() {
    //this.isOpen = !this.isOpen;
/* 
    const backdrop = document.querySelector('.offcanvas-backdrop');
    backdrop.remove(); */
  }
  toggleSidebar(){
    this.isCollapsed = !this.isCollapsed;
  }
  toggleCollapse(index: number) {
    //this.isCollapsed = !this.isCollapsed;
    
/*     if (this.collapsedItemIndices.has(index)) {
      this.collapsedItemIndices.delete(index);
  } else {
      this.collapsedItemIndices.add(index);
  } */

/*     if (this.collapsedItemIndices.has(index)) {
        // Si el índice ya está colapsado, lo elimina
        this.collapsedItemIndices.delete(index);
        // Remover la clase 'expanded' cuando se colapse
        document.querySelector('.nav-item:nth-child(' + (index + 1) + ') .nav-link')?.classList.remove('expanded');
    } else {
        // Si el índice no está colapsado, lo agrega
        this.collapsedItemIndices.add(index);
        // Agregar la clase 'expanded' cuando se expanda
        document.querySelector('.nav-item:nth-child(' + (index + 1) + ') .nav-link')?.classList.add('expanded');
    } */
}

/* isCollapsed(index: number) {
  return this.collapsedItemIndices.has(index);
} */
  toggleCollapses(i) {
    //this.isCollapsed[i] = !this.isCollapsed[i];
/*     const iconElement = document.querySelector('.custom-collapse .fa-chevron-down');

    if (iconElement) {
      if (this.isCollapsed) {
        iconElement.classList.add('rotate');
      } else {
        iconElement.classList.remove('rotate');
      }
    } */
  }

  ngOnInit(): void {
    if (!this.listenerRegistered) {
      this.setupOffcanvasListener();
      this.listenerRegistered = true;
    }
    this.registrarEvento();
  
    console.log('navbar');
    this.GeneraMenu();
  }

  setupOffcanvasListener() {
    this.renderer.listen('window', 'shown.bs.offcanvas', () => {
      console.log('Offcanvas abierto');
      this.offcanvasOpened = false;
      // Realizar acciones adicionales si es necesario
      this.offcanvasOpened = true;
    });
  }

  offcanvasOpenedx(event: Event) {
    event.stopPropagation(); // Detener la propagación del evento
    console.log('El offcanvas se ha abierto');
    // Aquí puedes ejecutar cualquier función que desees cuando se abra el offcanvas
  }

  registrarEvento() {
    // this.renderer.listen('window', 'shown.bs.offcanvas', () => {
    //   if (!this.offcanvasOpened) {
    //     console.log('Offcanvas abierto');
    //     // Realizar acciones adicionales si es necesario
    //     const offcanvas = document.querySelector('.offcanvas');
    //     const backdrop = document.querySelector('.offcanvas-backdrop');
    //     const offcanvasInstance = new bootstrap.Offcanvas(offcanvas);
    //     offcanvasInstance.hide();
    //     backdrop.remove();
    //       const backdropElement = document.querySelector('.offcanvas-backdrop');
    //     backdropElement.classList.remove('invisible');
          
        

    //     this.offcanvasOpened = true;
       
    //   }
    // });
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


  CerrarSesion() {
    Swal.fire({
      /* title: 'Are you sure?', */
      text: "¿Está seguro de querer cerrar sesión?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.appComponent.MODULOSPORGRUPO = [];
        this.router.navigate(['']); // tells them they've been logged out (somehow)
        this.authService.isLoggedIn();
      }
    })
    
  } 




}
