import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';

declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  public table: any = $('#table2');

  _combo_buscar;
  _combo_estados;
  _combo_ciudades;
  _combo_roles;
  data;
  file;
  title_modal;
  telefono;
  selectedFile: any;
  phoneNumber: string = '';
  fileTmp;
  id_usuario = 0;
  edita = 0;
  buscador = 'Activos';
  _lista;

  capturaFormBuscar = this.formBuilder.group({
    busca:['Activos'],
    activo:['']

  })

  capturaFormModal = this.formBuilder.group({
    nombre:['',Validators.required],
    apellido_paterno:['',Validators.required],
    apellido_materno:['',Validators.required],
    correo:['',Validators.required],
    estado:['',Validators.required],
    ciudad:['',Validators.required],
    rol:['',Validators.required],
    telefono:[''],
    file:['']
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
    this.comboEstados();
    this.listaUsuarios('Checked');
    
    //console.log('usuarios');
    //this.capturaFormModal.get('titulo').disable();
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileTmp = {
      fileRaw:file,
      fileName:file.name,
      filePath: 'archivos/usuarios/'
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFile = e.target.result;
        
      };
      reader.readAsDataURL(file);
      
    }
  }

  // esTerapeuta(event){
  //   let value = parseInt(event.target.value);
  //   if (value === 0) {
  //     // Si es_terapeuta es 0, deshabilitar el control nombre_usuario
  //     this.capturaFormModal.controls['titulo'].setValue('');
  //     this.capturaFormModal.get('titulo').disable();
  //   } else {
  //     // Si es_terapeuta es diferente de 0, habilitar el control nombre_usuario
  //     this.capturaFormModal.get('titulo').enable();
  //   }
  // }


  applyPhoneMask(event: any) {
    // Acceder al valor del campo de entrada
    const inputValue = event.target.value;
    
    // Eliminar todos los caracteres no numéricos del valor
    const numericValue = inputValue.replace(/\D/g, '');
    
    // Aplicar la máscara al número de teléfono
    let maskedValue = '';
    if (numericValue.length > 0) {
      maskedValue = '(' + numericValue.substring(0, 3);
      if (numericValue.length > 3) {
        maskedValue += ') ' + numericValue.substring(3, 6);
      }
      if (numericValue.length > 6) {
        maskedValue += '-' + numericValue.substring(6, 10);
      }
    }
    
    // Asignar el valor con la máscara aplicada al número de teléfono
    this.phoneNumber = maskedValue;
    this.capturaFormModal.controls['telefono'].setValue(maskedValue);
  }

  BuscarSeleccionado(item){
    this.buscador = item.target.value;
    var lista = this._lista;
    if(this.buscador === 'Inactivos'){
      lista = lista.filter(word => word.activo === 'Unchecked')
    } 
    else if(this.buscador === 'Activos'){
      lista = lista.filter(word => word.activo === 'Checked')
    }  
    this.data = lista;
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
      var c = _response.success.recordset;
      this._combo_roles = c.filter(d => d.es_modificable == 1 && d.id != 1);
   
    })
  }

  NuevoUsuario(){
    this.edita = 0;
    this.listaRoles();
    this.title_modal = 'Nuevo Usuario';
    this.capturaFormModal.get('nombre').enable();
    this.capturaFormModal.get('apellido_paterno').enable();
    this.capturaFormModal.get('apellido_materno').enable();
    this.capturaFormModal.get('correo').enable();
    this.capturaFormModal.get('estado').enable();
    this.capturaFormModal.get('ciudad').enable();
    this.capturaFormModal.get('rol').enable();
    this.capturaFormModal.get('telefono').enable();
    this.capturaFormModal.reset();
    this.fileTmp = {
      fileRaw:'',
      fileName:'',
      filePath: ''
    }

    this.selectedFile = '';
  }

  comboEstados(){
    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Trae_Estados',
      "params": []

    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      this._combo_estados = _response.success.recordset;
    })
  }

  estadoSelected(value){
    this.capturaFormModal.get('ciudad').enable();
    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Trae_Ciudades',
      "params": [value.target.value]

    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      this._combo_ciudades = _response.success.recordset;
    })
  }

  listaUsuarios(item){
    this.capturaFormModal.get('ciudad').enable();
    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Lista_Usuarios',
      "params": []

    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      var c = _response.success.recordset;
      this._lista = c;
      this.data = c.filter(c => c.activo === item);
    })
  }

  verDetalle(item){
    this.title_modal = 'Ver Detalle Usuario'
    $('#modalVerUsuario').modal('show');
    this.capturaFormModal.get('nombre').disable();
    this.capturaFormModal.get('apellido_paterno').disable();
    this.capturaFormModal.get('apellido_materno').disable();
    this.capturaFormModal.get('correo').disable();
    this.capturaFormModal.get('estado').disable();
    this.capturaFormModal.get('ciudad').disable();
    this.capturaFormModal.get('rol').disable();
    this.capturaFormModal.get('telefono').disable();

    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Trae_Ciudades',
      "params": [item.id_estado]

    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      this._combo_ciudades = _response.success.recordset;



      this.capturaFormModal.controls['nombre'].setValue(item.nombre);
      this.capturaFormModal.controls['apellido_paterno'].setValue(item.apellido_paterno);
      this.capturaFormModal.controls['apellido_materno'].setValue(item.apellido_materno);
      this.capturaFormModal.controls['correo'].setValue(item.correo);
      this.capturaFormModal.controls['estado'].setValue(item.id_estado);
      this.capturaFormModal.controls['ciudad'].setValue(item.id_ciudad);
      
      this.capturaFormModal.controls['telefono'].setValue(item.telefono);
      let data = {
        "appname":this.apiService.server(),
        "sp": 'dbo.Lista_Roles',
        "params": []
  
      }
  
      this.apiService.ejecuta(data).subscribe((response) => {
        var _response;
        _response = response;
        var c = _response.success.recordset;
        this._combo_roles = c.filter(d => d.es_modificable == 1);
        this.capturaFormModal.controls['rol'].setValue(item.id_rol);
     
      })
    })


  }

  editar(item){
    this.edita = 1;
    this.id_usuario = item.id;
    this.title_modal = 'Editar Usuario'
    $('#modalusuario').modal('show');
    
    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Trae_Ciudades',
      "params": [item.id_estado]

    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      this._combo_ciudades = _response.success.recordset;
      this.capturaFormModal.get('nombre').enable();
      this.capturaFormModal.get('apellido_paterno').enable();
      this.capturaFormModal.get('apellido_materno').enable();
      this.capturaFormModal.get('correo').enable();
      this.capturaFormModal.get('estado').enable();
      this.capturaFormModal.get('ciudad').enable();
      this.capturaFormModal.get('rol').enable();
      this.capturaFormModal.get('telefono').enable();
      this.capturaFormModal.controls['nombre'].setValue(item.nombre);
      this.capturaFormModal.controls['apellido_paterno'].setValue(item.apellido_paterno);
      this.capturaFormModal.controls['apellido_materno'].setValue(item.apellido_materno);
      this.capturaFormModal.controls['correo'].setValue(item.correo);
      this.capturaFormModal.controls['estado'].setValue(item.id_estado);
      this.capturaFormModal.controls['ciudad'].setValue(item.id_ciudad);
      
      this.capturaFormModal.controls['telefono'].setValue(item.telefono);
      let data = {
        "appname":this.apiService.server(),
        "sp": 'dbo.Lista_Roles',
        "params": []
  
      }
  
      this.apiService.ejecuta(data).subscribe((response) => {
        var _response;
        _response = response;
        var c = _response.success.recordset;
        this._combo_roles = c.filter(d => d.es_modificable == 1);
        this.capturaFormModal.controls['rol'].setValue(item.id_rol);
     
      })
    })


  }

  activo(item){
    if(item.id === parseInt(localStorage.getItem("id"))){
      this.appComponent.SwalModals('','No se puede inactivar el usuario logeado','error');
    }
    else{
      Swal.fire({
        title: "",
        text: "¿Esta seguro de querer inactivar al usuario '" + item.nombre + " " + item.apellido_paterno + " " + item.apellido_materno +  "' ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          let activo = 1;
          if(item.activo === 'Checked'){
            activo = 0;
          }
          
          var params=[item.id, activo]
          this.apiService.ejecutar('dbo.Activar_Inactivar_Usuario',params).subscribe((response) => {
            let _response;
            _response = response;
            let d = _response.success.recordsets[0];
            if(d[0].error == 1){
              this.appComponent.SwalModals('',d[0].mensaje, d[0].icono);
              //this.appComponent.hideSpinner();
              
            }
            if(d[0].error == 0){
              this.appComponent.SwalModals('',d[0].mensaje, d[0].icono);
              //this.appComponent.hideSpinner();
              /* $("#modal").prop("hidden",true);
              $('.modal-backdrop').hide() */
              $('.modal').click()
              
              window.scroll(0, 0);
              this.listaUsuarios(item.activo);
            }
      
            
          })  
        }
      });
      //this.dataset = arraySinDuplicados;

      
    }
    
  }

  guardar(item){
    if (this.capturaFormModal.valid) {
      // Realizar acción de guardado
      if(this.capturaFormModal.value.telefono == null || this.capturaFormModal.value.telefono == ''){
        this.appComponent.SwalModals('','Por favor complete todos los campos obligatorios.','error');
      }
      else{
        var data;
        data = this.capturaFormModal.value;
        let params = [this.id_usuario,JSON.stringify(data),item];
  
        this.apiService.ejecutar('dbo.Guarda_Usuario',params).subscribe((response) =>{
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
              if(this.fileTmp){
                var c = 'user_' + d[0].id + '.' + this.fileTmp.fileName.split('.').pop();
                this.appComponent.SwalModals('',d[0].mensaje, d[0].icono);
                const body = new FormData();
                body.append('myFile', this.fileTmp.fileRaw,this.fileTmp.fileName);
                body.append('directory', 'archivos/usuarios/');
                body.append('accion', 'nuevos');
                body.append('archivo', c);  
                this.apiService.uploadImage(body).subscribe((response) => {
                  let _response;
                  _response = response;
                  let params = [d[0].id,c];
    
                  this.apiService.ejecutar('dbo.Guarda_Imagen',params).subscribe((response) =>{
                    let _response;
                    _response = response;
                    $('#modalusuario').modal('hide');
                    $('.modal-backdrop').remove();
                    
                    this.listaUsuarios('Checked');
                
                  })
    
                })
              }
              else{
                $('#modalusuario').modal('hide');
                $('.modal-backdrop').remove();
                this.listaUsuarios('Checked');
                this.appComponent.SwalModals('',d[0].mensaje, d[0].icono);
              }
  
  
            }
          }
      
        });
      }

      
    } 
    else {
      // Mostrar un mensaje de error o realizar alguna acción adicional si el formulario no es válido
      console.log('Formulario no válido. Por favor complete todos los campos obligatorios.');
      this.appComponent.SwalModals('','Por favor complete todos los campos obligatorios.','error');
    }
  }


}
