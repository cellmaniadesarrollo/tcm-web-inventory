// inventario-tabla.component.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearPedido } from 'src/app/service/pedido/CrearPedido.service';
import { DymoserviceService } from 'src/app/service/dymoservice/dymoservice.service';
import { MatDialog } from '@angular/material/dialog';
import { ImprimirModalComponent } from '../imprimir-modal/imprimir-modal.component';

export interface InventarioItem {
  _id: string;
  sku: string;
  name_nameitems: string;
  name_model: string;
  name_color: string;
  name_quality: string;
  stateprod: string;
  totalStock: number;
  item_price: number;
  observations: string;
}

@Component({
  selector: 'app-inventario-tabla',
  templateUrl: './inventario-tabla.component.html',
  styleUrls: ['./inventario-tabla.component.css']
})
export class InventarioTablaComponent implements OnInit {
  @Input() items: InventarioItem[] = [];
  @Input() loading: boolean = false;
  @Input() totalEntries: number = 0;
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 10;

  @Output() pageChange = new EventEmitter<number>();
  @Output() verDetalle = new EventEmitter<string>();
  @Output() editarProducto = new EventEmitter<string>();
  @Output() nuevoPedido = new EventEmitter<void>();
  @Output() nuevoProducto = new EventEmitter<void>();
  
  @Output() imprimirNormal = new EventEmitter<{ id: string, cantidad: number }>();
  @Output() imprimirDymo = new EventEmitter<{ id: string, cantidad: number }>();

  @Input() busquedaFiltro: string = '';
  @Input() estadoFiltro: string = 'todos';
  @Output() filtroChange = new EventEmitter<{ estado: string, busqueda: string }>();

  displayedColumns: string[] = [
    'codigo', 
    'producto', 
    'modelo', 
    'color', 
    'calidad', 
    'stock', 
    'precio', 
    'acciones'
  ];

  // 👇 VARIABLE PARA CONTROLAR EL LOADING DE IMPRESIÓN
  imprimiendo: boolean = false;

  constructor(
    private router: Router,
    private apiPedido: CrearPedido,
    private apiticketdymmo: DymoserviceService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  // ======== MÉTODO PARA ABRIR MODAL ========

  abrirModalImpresion(item: InventarioItem, tipo: 'normal' | 'dymo' = 'normal'): void {
    console.log('📦 Abriendo modal para:', item.name_nameitems);
    
    const dialogRef = this.dialog.open(ImprimirModalComponent, {
      width: 'min(500px, 95vw)',
      maxWidth: '95vw',
      data: {
        id: item._id,
        nombre: item.name_nameitems || 'Producto',
        sku: item.sku || '-',
        stock: item.totalStock || 0,
        tipo: tipo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('📦 Resultado del modal:', result);
        const id = item._id;
        const cantidad = result.cantidad;
        const tipoImpresion = result.tipo;
        
        if (tipoImpresion === 'dymo') {
          this.imprimirDymo.emit({ id, cantidad });
          this.printDymo(id, cantidad);
        } else {
          this.imprimirNormal.emit({ id, cantidad });
          this.printNormal(id, cantidad);
        }
      }
    });
  }

  // ======== MÉTODOS DE IMPRESIÓN CORREGIDOS ========

  /**
   * Imprimir etiqueta normal (ticket)
   * ✅ AHORA HACE LA LLAMADA REAL AL BACKEND
   */
  async printNormal(id: string, cantidad: number = 1): Promise<void> {
    try {
      this.imprimiendo = true;
      console.log(`🖨️ Imprimiendo normal ${cantidad} etiqueta(s) para:`, id);
      
      // 🔥 LLAMADA REAL AL BACKEND
      const data = await this.apiPedido.ticketsincomes({ id, cantidad });
      
      console.log('📄 Respuesta del ticket:', data);
      
      if (data) {
        // Construir URL con los parámetros
        const params = new URLSearchParams({
          id: data._id || data.id || id,
          cantidad: cantidad.toString()
        });
        
        // Abrir en nueva ventana
        const url = `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;
        console.log('🖨️ Abriendo URL:', url);
        window.open(url, '_blank');
        
        // También puedes emitir el evento al padre
        this.imprimirNormal.emit({ id, cantidad });
      }
      
    } catch (error) {
      console.error('❌ Error imprimiendo normal:', error);
      // Mostrar error al usuario
    } finally {
      this.imprimiendo = false;
    }
  }

  /**
   * Imprimir en Dymo
   * ✅ AHORA HACE LA LLAMADA REAL AL BACKEND
   */
  async printDymo(id: string, cantidad: number = 1): Promise<void> {
    try {
      this.imprimiendo = true;
      console.log(`🖨️ Imprimiendo Dymo ${cantidad} etiqueta(s) para:`, id);
      
      // 🔥 LLAMADA REAL AL BACKEND
      const data = await this.apiPedido.ticketsincomes({ id, cantidad });
      
      console.log('📄 Respuesta del ticket Dymo:', data);
      
      if (data) {
        // Usar el servicio Dymo
        await this.apiticketdymmo.printTickets(data._id || data.id || id);
        console.log('✅ Impresión Dymo enviada para:', id);
        
        // También puedes emitir el evento al padre
        this.imprimirDymo.emit({ id, cantidad });
      }
      
    } catch (error) {
      console.error('❌ Error imprimiendo en Dymo:', error);
      // Mostrar error al usuario
    } finally {
      this.imprimiendo = false;
    }
  }

  // ======== MÉTODOS DE LA TABLA ========

  goToPage(page: number): void {
    if (page >= 1) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.pageChange.emit(1);
  }

  onFiltrosCambiados(estado: string): void {
    this.estadoFiltro = estado;
    this.filtroChange.emit({
      estado: this.estadoFiltro,
      busqueda: this.busquedaFiltro
    });
  }

  onNuevoPedido(): void { 
    this.nuevoPedido.emit(); 
  }
  
  onNuevoProducto(): void { 
    this.nuevoProducto.emit(); 
  }
  
  onVerDetalle(id: string): void { 
    this.verDetalle.emit(id); 
  }
  
  onEditarProducto(id: string): void { 
    this.editarProducto.emit(id); 
  }
}