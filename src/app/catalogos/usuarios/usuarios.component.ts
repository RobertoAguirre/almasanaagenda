import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  public table: any = $('#table2');

  _combo_buscar;
  title_modal;

  capturaFormBuscar = this.formBuilder.group({
    busca:['Activos'],
    activo:['']

  })

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private appComponent: AppComponent
/*     private router: Router,
    private appComponent: AppComponent */
  ) { 
    //this.appComponent.isLoggedIn();
  }

  ngOnInit(): void {
    console.log('usuarios');
    this._combo_buscar = [
      {nombre: 'Activos',activo:'Checked'},
      {nombre: 'Inactivos',activo:'Uncheked'},
      {nombre: 'Todos',id:''}
    ]
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      stateSave:false,
      order:[],
      language:{
        "processing": "Cargando ...",
        "search": "Buscar:",
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron registros",
        "info": "Mostrando página _PAGE_ de _PAGES_ de  _MAX_ registros",
        "infoEmpty": "No hay registros disponibles",
        "infoFiltered": "(fitrados de un total de  _MAX_ registros)",
        "paginate": {
          first: "",
          previous: "Anterior",
          next: "Siguiente",
          last: ""
        }
      }
    };
  }

  BuscarSeleccionado(item){
/*     this.buscador = item;
    var lista = this._lista;
    if(item === 'Inactivos'){
      lista = lista.filter(word => word.activo === 'Unchecked')
    } 
    else if(item === 'Activos'){
      lista = lista.filter(word => word.activo === 'Checked')
    }  
    this.dataset = lista; */
  }

  NuevoUsuario(){
    this.title_modal = 'Nuevo Usuario';
    
  }

}
