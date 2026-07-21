import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pedido-filtros',
  templateUrl: './pedido-filtros.component.html'
})
export class PedidoFiltrosComponent {
  @Output() cambioFiltro = new EventEmitter<{ estado: string, busqueda: string }>();

  estadoActual: string = 'todos'; // 'todos' | 'active' | 'rechazado' | 'inventario'
  textoBusqueda: string = '';

  onCambioEstado(nuevoEstado: string): void {
    this.estadoActual = nuevoEstado;
    this.emitirFiltros();
  }

  onBuscar(): void {
    this.emitirFiltros();
  }

  private emitirFiltros(): void {
    this.cambioFiltro.emit({
      estado: this.estadoActual,
      busqueda: this.textoBusqueda
    });
  }
}