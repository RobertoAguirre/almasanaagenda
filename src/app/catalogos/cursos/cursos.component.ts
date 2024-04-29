import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UntypedFormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  public table: any = $('#table2');

  _combo_buscar;
  _combo_estados;  
  
  data;
  file;
  title_modal;
  
  fileTmp;
  id_usuario = 0;
  id_curso = 0;
  lEditar:boolean = false;

  capturaFormBuscar = this.formBuilder.group({
    busca:['Activos'],
    activo:['']

  })

  capturaFormModal = this.formBuilder.group({
    id_curso:[''],
    nombre:['',Validators.required],
    impartido_por:['',Validators.required],
    duracion:['',Validators.required],
    costo:['',Validators.required],
    detalles:['',Validators.required],
    activo:['']
  })

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    public formBuilder: UntypedFormBuilder,
    private appComponent: AppComponent,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.comboEstados();
    this.lista();

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

  NuevoUsuario(){
    this.title_modal = 'Nuevo Curso';
    this.lEditar = true;
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

  lista(){
  
    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Lista_Cursos',
      "params": []
    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      this.data = _response.success.recordset;
    })
  }

  cancelar(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([window.location.pathname]);
    });
  }

  editar(item,lEditar:boolean){
    this.id_curso = item.id;
    this.lEditar = lEditar;
    this.title_modal = 'Editar';
    this.capturaFormModal.controls['id_curso'].setValue(item.id_curso);   
    this.capturaFormModal.controls['nombre'].setValue(item.nombre);   
    this.capturaFormModal.controls['impartido_por'].setValue(item.impartido_por);  
    this.capturaFormModal.controls['duracion'].setValue(item.duracion);  
    this.capturaFormModal.controls['costo'].setValue(item.costo);  
    this.capturaFormModal.controls['detalles'].setValue(item.detalles);   
    this.capturaFormModal.controls['activo'].setValue(item.activo);
    let data = {
      "appname":this.apiService.server(),
      "sp": 'dbo.Trae_Curso',
      "params": [item.id]
    }

    this.apiService.ejecuta(data).subscribe((response) => {
      var _response;
      _response = response;
      this.data = _response.success.recordset;
    })
  }

  guardar(){
    if (this.capturaFormModal.valid) {
      // Realizar acción de guardado
      var data;
      data = this.capturaFormModal.value;
      let params = [JSON.stringify(data)];

      this.apiService.ejecutar('dbo.Guarda_Curso',params).subscribe((response) =>{
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
            $('#modalusuario').modal('hide');
            $('.modal-backdrop').remove();
            this.appComponent.SwalModals('',d[0].mensaje, d[0].icono);
            this.cancelar();                        
          }
        }
      });
    } 
    else {
      // Mostrar un mensaje de error o realizar alguna acción adicional si el formulario no es válido
      console.log('Formulario no válido. Por favor complete todos los campos obligatorios.');
    }
  }
}
