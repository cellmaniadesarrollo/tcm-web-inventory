// pedido-inventario-tabla.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IPedido } from 'src/app/models/pedido.interface';

@Component({
  selector: 'app-pedido-inventario-tabla',
  templateUrl: './pedido-inventario-tabla.component.html',
  styleUrls: ['./pedido-inventario-tabla.component.css']
})
export class PedidoInventarioTablaComponent implements OnChanges {
  @Input() pedidos: IPedido[] = [];
  @Input() loading: boolean = false;
  @Input() pedidosSeleccionados: string[] = [];
  
  @Output() seleccionarPedido = new EventEmitter<IPedido>();

  pedidosFiltrados: IPedido[] = [];

  displayedColumns: string[] = [
    'name',
    'quantity',
    'estimatedPrice',
    'status',
    'createdBy',
    'sku',
    'batchId',
    'action'
  ];

  ngOnChanges(changes: SimpleChanges): void {
    this.filtrarPedidos();
  }

  /**
   * ✅ Filtra los pedidos que:
   * 1. Tienen status: 'inventario'
   * 2. NO tienen SKU (están pendientes de asignar)
   * 3. NO tienen BatchId (están pendientes de asignar)
   * 4. No han sido seleccionados previamente
   */
  private filtrarPedidos(): void {
    if (!this.pedidos || this.pedidos.length === 0) {
      this.pedidosFiltrados = [];
      return;
    }

    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      // ✅ Tiene estado 'inventario'
      const esInventario = pedido.status === 'inventario';
      
      // ✅ NO tiene SKU (aún no asignado)
      const noTieneSku = !pedido.sku || pedido.sku === '—' || pedido.sku === null;
      
      // ✅ NO tiene BatchId (aún no asignado)
      const noTieneBatch = !pedido.batchId || pedido.batchId === '—' || pedido.batchId === null;
      
      // ✅ No ha sido seleccionado previamente
      const noSeleccionado = !this.pedidosSeleccionados.includes(pedido._id);
      
      // ✅ Mostrar SOLO: inventario + sin SKU + sin Batch + no seleccionado
      return esInventario && noTieneSku && noTieneBatch && noSeleccionado;
    });

    console.log(`📋 Pedidos en inventario sin SKU/Batch: ${this.pedidosFiltrados.length} de ${this.pedidos.length}`);
  }

  onSeleccionarPedido(pedido: IPedido): void {
    this.seleccionarPedido.emit(pedido);
  }
}