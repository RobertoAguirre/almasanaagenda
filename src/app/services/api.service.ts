import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment, SERVER_URL, DB_INSTANCE, IP_SERVER } from '../../environments/environment';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,

  ) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': ''
    })
  }



  public pruebaGet() {
    try {
      return this.http.get(SERVER_URL + 'pruebaget');
    } catch (ex) {
      console.log(ex);
      return ex;
    }

  }


  public pruebaGetProtegido(tkn) {


    this.httpOptions.headers = this.httpOptions.headers.set('access-token', 'Bearer ' + tkn);

    try {
      return this.http.get(SERVER_URL + 'pruebagetProtegida', this.httpOptions);
    } catch (ex) {
      console.log(ex);
      return ex;
    }

  }

  public ejecuta(data) {
    
    return this.http.post(SERVER_URL + 'EjecutaConsulta/', data);
  }
  

  public ejecutar(sp,params) {
    let _params,
        _array = [],
        _length = params.length;
    

    params.forEach((value,key) => {
      if (_length === 1){
        _params ="'" + value + "'";
      }
      else{
        if(key === 0){
          _params = "'" + value + "','";
        }
        else if(key === _length - 1){
          _params = value + "'";
        }
        else{
          _params = value + "','";
        }  
      }
        
      _array.push(_params);
    })
    let data = {
      "appname":this.server(),
      "sp": sp,
      "params": _array

    }
    return this.http.post(SERVER_URL + 'EjecutaConsulta/', data);
  }

  public server() {
    return DB_INSTANCE
  }

  public apiServer(){
    return IP_SERVER
  }

  //trae token
  public autentifica(data) {

    return this.http.post(SERVER_URL + 'autentificar/', data);

  }

  //Alta Usuario
  public registra(data) {

    return this.http.post(SERVER_URL + 'registrar/', data);

  }

  //Reseteo Passsword Usuario
  public reseteoContrasena(data) {

    return this.http.post(SERVER_URL + 'reseteoContrasena/', data);

  }

  //subir archivos
  public uploadPhoto(formData) {

    return this.http.post(SERVER_URL + 'UploadFiles/', formData);
  }

    //subir imagen
    public uploadImage(body:FormData):Observable<any> {

      return this.http.post(SERVER_URL + 'UploadImage/', body);
    }

  //reset password
  public resetPassword(data) {
    return this.http.post(SERVER_URL + 'createCode/', data);
  }

  public createNewPassword(data) {
    return this.http.post(SERVER_URL + 'resetPassword/', data);
  }

  public EnviaEmail(data) {
    return this.http.post('http://localhost:4000/api/EnviarEmail/', data);
  }

  public SwalModalQuestion(data){
    return 
    /* Swal.fire({
      
      text: "Esta seguro de querer " + data,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        return true;
      }
      return false;
    }) */
  }


}
