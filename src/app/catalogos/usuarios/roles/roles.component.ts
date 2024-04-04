import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';

declare var $: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  public table: any = $('#table2');

  _combo_buscar;
  _combo_estados;
  _combo_ciudades;
  data;
  id_rol = 0;
  dataModulos;
  DataNiveles;
  title_modal;
  selectedFile: any;
  phoneNumber: string = '';

  capturaFormBuscar = this.formBuilder.group({
    busca:['Activos'],
    activo:['']

  })

  capturaFormModal = this.formBuilder.group({
    es_terapeuta:['0',Validators.required],
    titulo:['',Validators.required],
    nombre:['',Validators.required],
    apellido_paterno:['',Validators.required],
    apellido_materno:['',Validators.required],
    correo:['',[Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$')]],
    estado:['',Validators.required],
    ciudad:['',Validators.required],
    rol:['',Validators.required]
  })

  capturaFormDetalle = this.formBuilder.group({
    nombreDetalle:[{value: '', disabled: true}],
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
    this.listaRoles();
    //console.log('usuarios');
    this.capturaFormModal.get('titulo').disable();
    this.capturaFormModal.get('ciudad').disable();
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




  Nuevo(){
    this.title_modal = 'Nuevo Rol';
    this.id_rol = 0;
    this.capturaFormModal.controls['nombre'].setValue('');
    this.dataModulos = '';
    this.comboNiveles();
    this.listaModulos(0);
  }

  comboNiveles(){
    let params = [];

    this.apiService.ejecutar('dbo.Combo_Nivel_Seguridad',params).subscribe((response) =>{
      let _response;
      _response = response;
      this.DataNiveles = _response.success.recordset;
  
    }) 
  }

  listaModulos(item){
    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Trae_Modulos_Usuario2',
      "params": [item]

    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      this.dataModulos = _response.success.recordset;
   
    })
  }

  listaRoles(){
    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Lista_Roles',
      "params": []

    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      this.data = _response.success.recordset;
   
    })
  }

  Guardar(){
    console.log(this.dataModulos);
    let params = [this.id_rol,this.capturaFormModal.value.nombre,JSON.stringify(this.dataModulos)];
    console.log(params)
    this.apiService.ejecutar('Guarda_Modulos_Rol',params).subscribe((response) =>{
      let _response;
      _response = response;
      if(_response.err){
        this.appComponent.SwalModals('Internal Error',_response.err.originalError.info.message, 'error');        
      }
      else{
        let d = _response.success.recordsets[0];
        if(d[0].error == 1){
          this.appComponent.SwalModals('',d[0].mensaje, d[0].icono);                    
        }
        if(d[0].error == 0){
          this.appComponent.SwalModals('',d[0].mensaje, d[0].icono);
          $('#modalusuario').modal('hide');
          $('.modal-backdrop').remove();
          this.appComponent.GeneraMenu();
          this.listaRoles();
        }
      }
  
    }) 
  }

  verDetalle(item){
    this.dataModulos = '';
    this.title_modal = 'Detalle del Rol';
    this.capturaFormDetalle.controls['nombreDetalle'].setValue(item.nombre);
    this.comboNiveles();
    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Trae_Modulos_Usuario2',
      "params": [item.id]

    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      let c = _response.success.recordset;
      this.dataModulos = c.filter(d => d.nivel != 0);
      //this.dataModulos = _response.success.recordset;
   
    })
  }

  editar(item){
    this.id_rol = item.id;
    this.title_modal = 'Editar Rol';
    this.capturaFormModal.controls['nombre'].setValue(item.nombre);
    this.comboNiveles();
    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Trae_Modulos_Usuario2',
      "params": [item.id]

    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      // let c = _response.success.recordset;
      // this.dataModulos = c.filter(d => d.id_rol == item.id);
      this.dataModulos = _response.success.recordset;
   
    })
  }




}