import { Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { ResponsetokenI } from 'src/app/models/responsetoken.interface';

@Injectable({
  providedIn: 'root'
})
export class TokencheckService {
  @ViewChild('draggable') private draggableElement: any;
  
  constructor(private api: ApiService, private router: Router) {}
  data: ResponsetokenI={
    estatustoken:'',
    result:''
  };
  
  async checkLocalStorage() {
    if (localStorage.getItem('Token') && localStorage.getItem('User')) {
      await this.api.controltoken();
      
     } else {
        localStorage.removeItem('Token');
        localStorage.removeItem('User');
        
        console.log('aq')
        this.router.navigate(['login']);
      }
    }
}
