// pedido-tabla.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IPedido } from 'src/app/models/pedido.interface';

@Component({
  selector: 'app-pedido-tabla',
  templateUrl: './pedido-tabla.component.html',
  styleUrls: ['./pedido-tabla.component.css']
})
export class PedidoTablaComponent {
  @Input() pedidos: IPedido[] = [];
  @Input() loading: boolean = false;
  
  // ✅ Eventos para el padre
  @Output() inventariarPedido = new EventEmitter<IPedido>();
  @Output() rechazarPedido = new EventEmitter<IPedido>();
  
  // ✅ NUEVO: Evento para seleccionar pedido (desde el modal de ingreso)
  @Output() seleccionarPedido = new EventEmitter<IPedido>();

  /**
   * Inventariar pedido - Cambia estado a 'inventario'
   */
  onInventariarPedido(pedido: IPedido): void {
    this.inventariarPedido.emit(pedido);
  }

  /**
   * Rechazar pedido - Cambia estado a 'rechazado'
   */
  onRechazarPedido(pedido: IPedido): void {
    this.rechazarPedido.emit(pedido);
  }

  /**
   * Seleccionar pedido (para el modal de ingreso)
   */
  onSeleccionarPedido(pedido: IPedido): void {
    this.seleccionarPedido.emit(pedido);
  }
}