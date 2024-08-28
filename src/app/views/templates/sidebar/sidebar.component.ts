import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(private router: Router) {}
  nivel1 = false;
  nivel2 = false;
  nivel3=false
  user: any;
  ngOnInit(): void {
    this.loadimg();
    // this.checkLocalStorage();
    this.user = localStorage.getItem('User');
    const group = localStorage.getItem('Groups') || '';
    this.nivel2 = group
      .split(',')
      .some((x: any) => x == 'IFE' || x == 'ADMINS');
    this.nivel1 = group
      .split(',')
      .some((x: any) => x == 'CSRS' || x == 'ADMINS');
      this.nivel3 = group
      .split(',')
      .some((x: any) => x == 'CSRSPER' || x == 'ADMINS');
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
    this.linksdata();
  }
  userimg: any = false;
  loadimg() {
    const data = localStorage.getItem('Userimg');
    if (data != 'false') {
      this.userimg = data;
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

  open: boolean = false;
  activebut: boolean = false;
  open1: boolean = false;
  activebut1: boolean = false;
  // Método para manejar el clic en un ítem del menú
  handleClick() {
    if (this.open) {
      return (this.open = false);
    } else {
      return (this.open = true);
    }
  }
  handleClick1() {
    if (this.open1) {
      return (this.open1 = false);
    } else {
      return (this.open1 = true);
    }
  }
  async linksdata() {
    await this.sleep(10);
    if (
      this.router.url === '/movements' ||
      this.router.url === '/inventory' ||
      this.router.url === '/incomerep'
    ) {
      return (
        (this.activebut = true), (this.activebut1 = false), (this.open = true)
      );
    } else if (this.router.url === '/inventoryper') {
      return (
        (this.activebut1 = true), (this.activebut = false), (this.open1 = true)
      );
    } else {
      return (this.activebut1 = false), (this.activebut = false);
    }
  }

  sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
