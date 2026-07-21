// pedidos.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from 'src/app/service/pedido/pedido.service';
import { ApiService } from 'src/app/service/api/api.service';
import { NuevoPedidoComponent } from './components/nuevo-pedido/nuevo-pedido.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedidoModalComponent } from './components/pedido-modal/pedido-modal.component';
import { IPedido } from 'src/app/models/pedido.interface';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  @ViewChild('nuevoProductoModal') nuevoProductoModal!: NuevoPedidoComponent;

  // ============ INVENTARIO (app-inventario-tabla) ============
  items: any[] = [];
  loading: boolean = false;
  totalEntries: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  estadoFiltro: string = 'todos';
  busquedaFiltro: string = '';

  // ============ PEDIDOS (app-pedido-tabla) ============
  pedidosPendientes: IPedido[] = [];
  pedidosInventario: IPedido[] = [];
  loadingPedidos: boolean = false;

  // Tab activo
  activeTab: number = 0;

  constructor(
    private api: ApiService,
    private pedidoService: PedidoService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarInventario();
    this.cargarPedidosPendientes();
  }

  // ============================================================
  //  TABS
  // ============================================================

  onTabChange(event: any): void {
    this.activeTab = event.index;
    if (this.activeTab === 1) {
      this.cargarPedidosPendientes();
    } else if (this.activeTab === 2) {
      this.cargarPedidosEnInventario();
    }
  }

  // ============================================================
  //  INVENTARIO - Métodos para app-inventario-tabla
  // ============================================================

  async cargarInventario(): Promise<void> {
    this.loading = true;
    try {
      const params: any = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        allclients: '0',
        inventory: '0',
        numperpage: this.itemsPerPage.toString(),
        findlike: this.busquedaFiltro || '',
        pagination: this.currentPage
      };

      const res: any = await this.api.listincomes(params);
      
      if (res && res.intake) {
        this.items = res.intake.map((income: any) => {
          const snapshot = income.inventory_snapshot || {};
          let stateprod = snapshot.stateprod || 'NUEVO';
          
          if (income.incomestype?.name_incomestypes) {
            const estadoMap: {[key: string]: string} = {
              'APROBADO': 'NUEVO',
              'PENDIENTE': 'USADO',
              'RECHAZADO': 'DAÑADO'
            };
            stateprod = estadoMap[income.incomestype.name_incomestypes] || stateprod;
          }

          return {
            _id: income._id || snapshot.inventory_id,
            sku: snapshot.sku || '',
            cod_upc: snapshot.upc || '',
            name_nameitems: snapshot.name_item || 'Sin nombre',
            name_model: snapshot.name_model || 'Sin modelo',
            name_color: snapshot.name_color || 'Sin color',
            name_quality: snapshot.name_quality || 'Sin calidad',
            stateprod: stateprod,
            totalStock: income.quantity || 0,
            item_price: parseFloat(income.unit_sales_price) || 0,
            observations: income.observations || '',
            income_id: income._id,
            quantity: income.quantity,
            unit_price: income.unit_price,
            date_income: income.date_income,
            user_create: income.user_create
          };
        });
        
        this.totalEntries = res.number_of_records || 0;
        this.currentPage = res.actual_page || 1;
        this.itemsPerPage = res.number_of_records_per_page || 10;
      } else {
        this.items = [];
        this.totalEntries = 0;
      }
    } catch (error) {
      console.error('Error al cargar inventario:', error);
      this.items = [];
      this.totalEntries = 0;
    } finally {
      this.loading = false;
    }
  }

  onFiltrosCambiados(filtros: { estado: string, busqueda: string }): void {
    this.estadoFiltro = filtros.estado;
    this.busquedaFiltro = filtros.busqueda;
    this.currentPage = 1;
    this.cargarInventario();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarInventario();
  }

  verDetalle(id: string): void {
    const item = this.items.find(i => i._id === id);
    console.log('Detalle del producto:', item);
  }

  editarProducto(id: string): void {
    this.router.navigate(['/inventorynew', id]);
  }

  irANuevoPedido(): void {
    const dialogRef = this.dialog.open(PedidoModalComponent, {
      width: '850px',
      maxWidth: '90vw',
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarInventario();
      }
    });
  }

  irANuevoProducto(): void {
    const dialogRef = this.dialog.open(NuevoPedidoComponent, {
      width: '950px',
      maxWidth: '95vw',
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarInventario();
      }
    });
  }

  onNuevoProductoModalClose(event: any): void {
    if (event?.reload) {
      this.cargarInventario();
    }
  }

  // ============================================================
  //  PEDIDOS - Métodos para app-pedido-tabla
  // ============================================================

  async cargarPedidosPendientes(): Promise<void> {
    this.loadingPedidos = true;
    try {
      const response = await this.pedidoService.getPedidosPendientes(
        this.currentPage,
        this.itemsPerPage
      );
      this.pedidosPendientes = response.data?.pedidos || [];
    } catch (error) {
      console.error('Error al cargar pedidos pendientes:', error);
      this.pedidosPendientes = [];
    } finally {
      this.loadingPedidos = false;
    }
  }

  async cargarPedidosEnInventario(): Promise<void> {
    this.loadingPedidos = true;
    try {
      const response = await this.pedidoService.getPedidosEnInventario(
        this.currentPage,
        this.itemsPerPage
      );
      this.pedidosInventario = response.data?.pedidos || [];
    } catch (error) {
      console.error('Error al cargar pedidos en inventario:', error);
      this.pedidosInventario = [];
    } finally {
      this.loadingPedidos = false;
    }
  }

  /**
   * ✅ NUEVO: INVENTARIAR PEDIDO - Cambia estado a 'inventario'
   * Usando .then() porque el service devuelve Promise
   */
  onInventariarPedido(pedido: IPedido): void {
    if (confirm(`¿Marcar el pedido "${pedido.name}" como inventariado?`)) {
      this.pedidoService.cambiarEstado(pedido._id, 'inventario')
        .then((response: any) => {
          this.snackBar.open('✅ Pedido marcado como inventariado', 'Cerrar', { duration: 3000 });
          this.cargarPedidosPendientes();
          this.cargarInventario();
        })
        .catch((error: any) => {
          console.error('Error al inventariar pedido:', error);
          this.snackBar.open('❌ Error al inventariar pedido', 'Cerrar', { duration: 3000 });
        });
    }
  }

  /**
   * RECHAZAR PEDIDO - Cambia estado a 'rechazado'
   * Usando .then() porque el service devuelve Promise
   */
  onRechazarPedido(pedido: IPedido): void {
    if (confirm(`¿Rechazar el pedido "${pedido.name}"?`)) {
      this.pedidoService.cambiarEstado(pedido._id, 'rechazado')
        .then((response: any) => {
          this.snackBar.open('❌ Pedido rechazado', 'Cerrar', { duration: 3000 });
          this.cargarPedidosPendientes();
        })
        .catch((error: any) => {
          console.error('Error al rechazar pedido:', error);
          this.snackBar.open('❌ Error al rechazar pedido', 'Cerrar', { duration: 3000 });
        });
    }
  }

  /**
   * SELECCIONAR PEDIDO - Abre el modal de ingreso con el pedido seleccionado
   */
  onSeleccionarPedido(pedido: IPedido): void {
    const dialogRef = this.dialog.open(PedidoModalComponent, {
      width: '850px',
      maxWidth: '90vw',
      disableClose: true,
      autoFocus: false,
      data: {
        pedido: pedido,
        mode: 'seleccionar-desde-tabla'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarPedidosPendientes();
        this.cargarInventario();
      }
    });
  }

  /**
   * Abre el modal de NuevoProductoComponent y pasa el pedido seleccionado
   */
  abrirModalCrearProducto(pedido: IPedido): void {
    const dialogRef = this.dialog.open(NuevoPedidoComponent, {
      width: '950px',
      maxWidth: '95vw',
      disableClose: true,
      autoFocus: false,
      data: {
        pedido: pedido,
        mode: 'crear-desde-pedido'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarPedidosPendientes();
        this.cargarInventario();
      }
    });
  }
}