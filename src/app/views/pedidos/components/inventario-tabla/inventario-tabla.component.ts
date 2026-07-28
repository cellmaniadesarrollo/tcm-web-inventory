// inventario-tabla.component.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearPedido } from 'src/app/service/pedido/CrearPedido.service';
import { DymoserviceService } from 'src/app/service/dymoservice/dymoservice.service';
import { MatDialog } from '@angular/material/dialog';
import { ImprimirModalComponent } from '../imprimir-modal/imprimir-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  imprimiendo: boolean = false;

  constructor(
    private router: Router,
    private apiPedido: CrearPedido,
    private apiticketdymmo: DymoserviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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

  // ============================================================
  //  ✅ MÉTODO DE IMPRESIÓN - SOPORTA AMBOS FORMATOS
  // ============================================================

  /**
   * Imprime el ticket usando los datos del backend
   * SOPORTA: { print: { id: {...}, printer: '...' } } O { topText1: '...', cant: 1, ... }
   */
  private async imprimirTicket(data: any): Promise<void> {
    try {
      console.log('🖨️ Iniciando proceso de impresión...');
      console.log('📦 Datos recibidos:', data);
      
      // ============================================================
      //  ✅ DETECTAR FORMATO DE DATOS
      // ============================================================
      
      let ticketData: any = null;
      let printer: string = 'zebra'; // Por defecto
      
      // FORMATO 1: { print: { id: {...}, printer: '...' } }
      if (data?.print?.id) {
        console.log('📦 Formato 1 detectado: print.id');
        ticketData = data.print.id;
        printer = data.print.printer || 'zebra';
      }
      // FORMATO 2: { topText1: '...', cant: 1, ... } (DATOS DIRECTOS)
      else if (data?.topText1 || data?.cant) {
        console.log('📦 Formato 2 detectado: datos directos');
        ticketData = data;
        printer = data.printer || 'zebra';
      }
      // FORMATO 3: { id: { topText1: '...', ... } } (con id anidado)
      else if (data?.id?.topText1) {
        console.log('📦 Formato 3 detectado: data.id');
        ticketData = data.id;
        printer = data.printer || 'zebra';
      }
      
      if (!ticketData) {
        console.warn('⚠️ No se pudieron extraer los datos del ticket');
        console.log('📦 Data recibida:', JSON.stringify(data, null, 2));
        this.snackBar.open('⚠️ No se pudieron extraer los datos del ticket', 'Cerrar', { duration: 3000 });
        return;
      }

      console.log('📦 Datos del ticket:', ticketData);
      console.log('🖨️ Impresora:', printer);

      // ============================================================
      //  ✅ CONSTRUIR PARÁMETROS PARA IMPRESIÓN
      // ============================================================
      
      const params = new URLSearchParams();
      
      // Agregar todos los campos del ticket
      if (ticketData.topText1) params.append('topText1', ticketData.topText1);
      if (ticketData.topText2) params.append('topText2', ticketData.topText2);
      if (ticketData.bottomText1) params.append('bottomText1', ticketData.bottomText1);
      if (ticketData.cant) params.append('cant', String(ticketData.cant));
      if (ticketData.qrText) params.append('qrText', ticketData.qrText);
      if (ticketData.price) params.append('price', String(ticketData.price));
      if (ticketData.f) params.append('f', ticketData.f);
      if (ticketData.iva !== undefined) params.append('iva', String(ticketData.iva));
      
      // Si hay un id en los datos, agregarlo
      if (data?.incomeId) params.append('id', data.incomeId);
      else if (data?.id && typeof data.id === 'string') params.append('id', data.id);
      else if (ticketData.id) params.append('id', ticketData.id);

      const url = `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;
      console.log('🌐 URL de impresión:', url);

      // ============================================================
      //  ✅ EJECUTAR IMPRESIÓN SEGÚN TIPO
      // ============================================================
      
      if (printer === 'dymo') {
        // DYMO - usar el servicio
        console.log('🖨️ Imprimiendo en Dymo...');
        try {
          const incomeId = data?.incomeId || data?.id;
          if (incomeId && typeof incomeId === 'string') {
            await this.apiticketdymmo.printTickets(incomeId);
            console.log('✅ Impresión Dymo enviada');
            this.snackBar.open('🖨️ Imprimiendo en Dymo...', 'Cerrar', { duration: 2000 });
          } else {
            // Fallback a URL
            this.abrirVentanaImpresion(url);
          }
        } catch (error) {
          console.error('❌ Error en Dymo, fallback a normal:', error);
          this.abrirVentanaImpresion(url);
        }
      } else {
        // ZEBRA / NORMAL
        console.log('🖨️ Imprimiendo en Zebra/Normal...');
        this.abrirVentanaImpresion(url);
        this.snackBar.open('🖨️ Enviando a imprimir...', 'Cerrar', { duration: 2000 });
      }

    } catch (error) {
      console.error('❌ Error en imprimirTicket:', error);
      this.snackBar.open('⚠️ Error al imprimir', 'Cerrar', { duration: 3000 });
    }
  }

  /**
   * Abre ventana de impresión con fallback
   */
  private abrirVentanaImpresion(url: string): void {
    try {
      const ventana = window.open(url, '_blank');
      if (!ventana) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('❌ Error al abrir ventana:', error);
      this.snackBar.open('⚠️ No se pudo abrir la ventana de impresión', 'Cerrar', { duration: 3000 });
    }
  }

  // ============================================================
  //  ✅ printNormal CORREGIDO
  // ============================================================

  async printNormal(id: string, cantidad: number = 1): Promise<void> {
    if (this.imprimiendo) {
      this.snackBar.open('⏳ Ya hay una impresión en curso', 'Cerrar', { duration: 2000 });
      return;
    }

    try {
      this.imprimiendo = true;
      console.log(`🖨️ Imprimiendo normal ${cantidad} etiqueta(s) para:`, id);
      
      // Llamar al API - esto ya devuelve los datos del ticket directamente
      const data = await this.apiPedido.ticketsincomes({ id, cantidad });
      console.log('📄 Respuesta del ticket:', data);
      
      if (data) {
        // ✅ Pasar los datos directamente a imprimirTicket
        await this.imprimirTicket(data);
        this.imprimirNormal.emit({ id, cantidad });
      }
      
    } catch (error: any) {
      console.error('❌ Error imprimiendo normal:', error);
      this.snackBar.open(`❌ Error: ${error.message || 'Error al imprimir'}`, 'Cerrar', { duration: 5000 });
    } finally {
      this.imprimiendo = false;
    }
  }

  // ============================================================
  //  ✅ printDymo CORREGIDO
  // ============================================================

  async printDymo(id: string, cantidad: number = 1): Promise<void> {
    if (this.imprimiendo) {
      this.snackBar.open('⏳ Ya hay una impresión en curso', 'Cerrar', { duration: 2000 });
      return;
    }

    try {
      this.imprimiendo = true;
      console.log(`🖨️ Imprimiendo Dymo ${cantidad} etiqueta(s) para:`, id);
      
      // Llamar al API - esto ya devuelve los datos del ticket directamente
      const data = await this.apiPedido.ticketsincomes({ id, cantidad });
      console.log('📄 Respuesta del ticket Dymo:', data);
      
      if (data) {
        // ✅ Pasar los datos directamente a imprimirTicket
        await this.imprimirTicket(data);
        this.imprimirDymo.emit({ id, cantidad });
      }
      
    } catch (error: any) {
      console.error('❌ Error imprimiendo en Dymo:', error);
      this.snackBar.open(`❌ Error: ${error.message || 'Error al imprimir en Dymo'}`, 'Cerrar', { duration: 5000 });
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