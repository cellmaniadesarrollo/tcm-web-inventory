import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VglobalService } from 'src/app/service/vglobal/vglobal.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private router: Router, private global: VglobalService) {}
  nivel1 = false;
  nivel2 = false;
  user: any;
  ngOnInit(): void {
    this.loadimg()
    // this.checkLocalStorage();
    this.user = localStorage.getItem('User');
    const group = localStorage.getItem('Groups') || '';
    this.nivel2 = group
      .split(',')
      .some((x: any) => x == 'IFE' || x == 'ADMINS');
    this.nivel1 = group
      .split(',')
      .some((x: any) => x == 'CSRS' || x == 'ADMINS');
    if (group != '') {
      if (!this.nivel2 && this.urlnivel2()) {
        this.router.navigate(['dashboard']);
      }
      if (!this.nivel1 && this.urlnivel1()) {
        this.router.navigate(['income']);
      }
    } else {
      localStorage.removeItem('Token');
      localStorage.removeItem('User');
      localStorage.removeItem('Groups');
      this.router.navigate(['login']);
    }
  }
userimg:any=false
loadimg(){
  const data= localStorage.getItem('Userimg');
 if(data!='false'){
this.userimg=data
 }
}


  urlnivel2() {
    const url = this.router.url;
    switch (url) {
      case '/income':
        return true;
      default:
        return false;
    }
  }

  urlnivel1() {
    const url = this.router.url;
    switch (url) {
      case '/inventory':
        return true;
      case '/dashboard':
        return true;
      case '/movements':
        return true;
      case '/incomerep':
        return true;
      default:
        return false;
    }
  }

  logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('User');
    localStorage.removeItem('Groups');
    this.router.navigate(['login']);
  }

  orders() {
    this.router.navigate(['orders']);
  }

  inventory() {
    this.router.navigate(['inventory']);
  }
  inicio() {
    this.router.navigate(['dashboard']);
  }
  movements() {
    this.router.navigate(['movements']);
  }
  income() {
    this.router.navigate(['income']);
  }
  incomerep() {
    this.router.navigate(['incomerep']);
  }
  perfil() {
    this.router.navigate(['perfil']);
  }

  nivel12: boolean = true; // Variable para controlar si el menú está desplegado

  // Método para manejar el clic en un ítem del menú
  handleClick() {
    this.nivel12 = false; // Cierra el menú cuando se hace clic en un ítem
  }
}
