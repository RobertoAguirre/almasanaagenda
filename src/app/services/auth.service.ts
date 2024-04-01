import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private Token;

  constructor() { 
    this.Token = localStorage.getItem('tkn');
  }

  isLoggedIn(): boolean {
    
    if(this.Token !== undefined && this.Token !== null){
      this.Token = localStorage.getItem('tkn');
      
      return true;

    }else{
      return false;
    }

    
  }
  
  setToken(tkn){
    this.Token =  tkn;
  }

  getToken(){
    return this.Token;
  }

}
