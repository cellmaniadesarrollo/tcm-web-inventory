import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApireportsService } from 'src/app/service/apireports/apireports.service';

interface Producto {
  seleccionado: boolean;
  codigo: string;
  nombre: string;
  modelo: string;
  color: string;
  calidad: string;
  cantidad: number;
  sucursal: string;
  inventario: string;
}
interface Sucursales {
  _id: string;
  name: string; 
}
interface Inventarionombre {
  _id: string;
  inventory_name: string; 
}
@Component({
  selector: 'app-ticket-printer',
  templateUrl: './ticket-printer.component.html',
  styleUrls: ['./ticket-printer.component.css']
})
export class TicketPrinterComponent {
  constructor(private apireports: ApireportsService) { }
  filtro = ''; 
  inventarios:Inventarionombre[] = [ ];
  sucursales:Sucursales[] = [];
  productos: Producto[] = [
    { seleccionado: false, codigo: 'P001', nombre: 'Producto 1', modelo: 'M1', color: 'Rojo', calidad: 'Alta', cantidad: 10, sucursal: 'Sucursal 1', inventario: 'Inventario A' },
    { seleccionado: false, codigo: 'P002', nombre: 'Producto 2', modelo: 'M2', color: 'Azul', calidad: 'Media', cantidad: 5, sucursal: 'Sucursal 2', inventario: 'Inventario B' },
    { seleccionado: false, codigo: 'P003', nombre: 'Producto 3', modelo: 'M3', color: 'Verde', calidad: 'Alta', cantidad: 8, sucursal: 'Sucursal 3', inventario: 'Inventario C' },
    { seleccionado: false, codigo: 'P004', nombre: 'Producto 4', modelo: 'M4', color: 'Negro', calidad: 'Baja', cantidad: 12, sucursal: 'Sucursal 4', inventario: 'Inventario D' },
    // Agrega más productos para probar la paginación
  ];
  datapage = {
    inventarios: '',
    sucursales: '',
    pagination: 1,
    numperpage: '30',
    findlike: '',
  };

  itemsPorPagina = 5;
  paginaActual = 1;
  opcionesItemsPorPagina = [30, 50, 100, 200];
  ngOnInit(): void {
    this.getdata()
  }
  async getdata() {
    const data = await this.apireports.getitemsinventorys(this.datapage)
    this.sucursales=data.branches
    this.inventarios=data.inventorysnames
    console.log(data)
  }
  get totalPaginas(): number {
    return Math.ceil(this.productos.length / this.itemsPorPagina);
  }

  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.productos.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  cambiarItemsPorPagina(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.itemsPorPagina = Number(value);
    this.paginaActual = 1; // Reinicia a la primera página
  }

  imprimirSeleccionados() {
    const seleccionados = this.productos.filter(p => p.seleccionado);
    console.log('Productos seleccionados:', seleccionados, this.datapage);
  }
  toggleSeleccionarTodos(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.productos.forEach(p => p.seleccionado = checked);
  }
}
