import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

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

@Component({
  selector: 'app-ticket-printer',
  templateUrl: './ticket-printer.component.html',
  styleUrls: ['./ticket-printer.component.css']
})
export class TicketPrinterComponent {
  form: FormGroup;
  productos: Producto[] = [
    { seleccionado: false, codigo: 'P001', nombre: 'Producto 1', modelo: 'M1', color: 'Rojo', calidad: 'Alta', cantidad: 10, sucursal: 'Sucursal 1', inventario: 'Inventario A' },
    { seleccionado: false, codigo: 'P002', nombre: 'Producto 2', modelo: 'M2', color: 'Azul', calidad: 'Media', cantidad: 5, sucursal: 'Sucursal 2', inventario: 'Inventario B' },
  ];

  displayedColumns: string[] = ['seleccionado', 'codigo', 'nombre', 'modelo', 'cantidad','1','2','3','4'];
  dataSource = new MatTableDataSource<Producto>(this.productos);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      inventario: [''],
      sucursal: [''],
      buscar: ['']
    });
  }

  imprimirSeleccionados() {
    const seleccionados = this.productos.filter(p => p.seleccionado);
    console.log('Productos seleccionados:', seleccionados);
  }
}
