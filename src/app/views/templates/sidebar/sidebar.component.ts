// sidebar.component.ts

import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; 
import { SharedServiceService } from 'src/app/service/SharedService/shared-service.service';
import { PedidoService } from 'src/app/service/pedido/pedido.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnDestroy {
  constructor(
    private router: Router,
    private sharedService: SharedServiceService,
    private pedidoService: PedidoService
  ) {}

  nivel1 = false;
  nivel2 = false;
  nivel3 = false;
  nivel4 = false;
  user: any;
  datoRecibido: any;
  
  // ✅ Contador de pedidos pendientes
  pedidosPendientesCount: number = 0;
  private refreshSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.loadimg();
    this.sharedService.currentData$.subscribe(data => {
      this.datoRecibido = data; 
    });

    this.user = localStorage.getItem('User');
    const group = localStorage.getItem('Groups') || '';
    this.nivel2 = group.split(',').some((x: any) => x == 'IFE' || x == 'ADMINS');
    this.nivel1 = group.split(',').some((x: any) => x == 'CSRS' || x == 'ADMINS');
    this.nivel3 = group.split(',').some((x: any) => x == 'CSRSPER' || x == 'ADMINS');
    this.nivel4 = group.split(',').some((x: any) => x == 'CSRSSALE' || x == 'ADMINS');
    
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

    // ✅ Cargar el contador de pedidos pendientes
    this.cargarPedidosPendientesCount();
    
    // ✅ Actualizar cada 30 segundos
    this.refreshSubscription = interval(30000)
      .pipe(
        switchMap(() => this.pedidoService.getPedidosPendientesCount())
      )
      .subscribe({
        next: (count) => {
          this.pedidosPendientesCount = count;
        },
        error: (error) => {
          console.error('Error al actualizar conteo de pedidos:', error);
        }
      });
  }

  ngOnDestroy(): void {
    // ✅ Limpiar la suscripción al destruir el componente
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // ============================================================
  //  ✅ CARGAR CONTEO DE PEDIDOS PENDIENTES
  // ============================================================

  async cargarPedidosPendientesCount(): Promise<void> {
    try {
      this.pedidosPendientesCount = await this.pedidoService.getPedidosPendientesCount();
      console.log('📋 Pedidos pendientes:', this.pedidosPendientesCount);
    } catch (error) {
      console.error('Error al cargar pedidos pendientes:', error);
      this.pedidosPendientesCount = 0;
    }
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
      case '/pedido':
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
  open2: boolean = false;
  activebut1: boolean = false;
  activebut2: boolean = false;

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
  
  handleClick2() {
    if (this.open1) {
      return (this.open2 = false);
    } else {
      return (this.open2 = true);
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