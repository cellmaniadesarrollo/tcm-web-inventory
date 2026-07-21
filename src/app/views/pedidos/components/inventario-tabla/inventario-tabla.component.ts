import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';

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

  // Filtros
  @Input() busquedaFiltro: string = '';
  @Input() estadoFiltro: string = 'todos';
  @Output() filtroChange = new EventEmitter<{ estado: string, busqueda: string }>();

  // Definición de las columnas para mat-table
  displayedColumns: string[] = [
    'codigo', 
    'producto', 
    'modelo', 
    'color', 
    'calidad', 
    'estado', 
    'stock', 
    'precio', 
    'acciones'
  ];

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {}

  /**
   * Cambia a una página específica (botones del pager)
   */
  goToPage(page: number): void {
    if (page >= 1) {
      this.pageChange.emit(page);
    }
  }

  /**
   * Modifica el tamaño del límite por página
   */
  onPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.pageChange.emit(1); // Reiniciar a la página 1 con el nuevo tamaño
  }

  /**
   * Aplica filtros desde el toggler o la búsqueda enter
   */
  onFiltrosCambiados(estado: string): void {
    this.estadoFiltro = estado;
    this.filtroChange.emit({
      estado: this.estadoFiltro,
      busqueda: this.busquedaFiltro
    });
  }

  onNuevoPedido(): void { this.nuevoPedido.emit(); }
  onNuevoProducto(): void { this.nuevoProducto.emit(); }
  onVerDetalle(id: string): void { this.verDetalle.emit(id); }
  onEditarProducto(id: string): void { this.editarProducto.emit(id); }
}