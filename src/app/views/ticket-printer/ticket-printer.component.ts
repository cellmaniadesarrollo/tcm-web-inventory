import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApireportsService } from 'src/app/service/apireports/apireports.service';

interface Producto {
  seleccionado: boolean;
  _id: string;
  sku: string;
  observations: string;
  name: string;
  color: string;
  model: string;
  state: string;
  qualitys: string;
  stocks: string;
  branches: string;
  price: string;
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

  inventarios: Inventarionombre[] = [];
  sucursales: Sucursales[] = [];
  productos: Producto[] = [];
  totalProductos: number = 0;

  datapage = {
    inventarios: '',
    sucursales: '',
    pagination: 1,
    numperpage: 30,
    findlike: '',
  };

  opcionesItemsPorPagina = [30, 50, 100, 200];

  ngOnInit(): void {
    this.getdata();
  }

  async getdata() {
    try {
      const data = await this.apireports.getitemsinventorys(this.datapage);
      this.productos = data.items.intake;
      this.totalProductos = data.items.number_of_records;
      this.sucursales = data.branches;
      this.inventarios = data.inventorysnames;
    } catch (error) {
      console.error('Error al obtener los datos', error);
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalProductos / this.datapage.numperpage);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.datapage.pagination = nuevaPagina;
      this.getdata();
    }
  }

  cambiarItemsPorPagina(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.datapage.numperpage = value;
    this.datapage.pagination = 1; // Reiniciar a la primera página
    this.getdata();
  }

  getPaginasVisibles() {
    let paginas = [];
    let start = Math.max(1, this.datapage.pagination - 2);
    let end = Math.min(this.totalPaginas, this.datapage.pagination + 2);
    for (let i = start; i <= end; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  async imprimirSeleccionados() {
    const seleccionados = this.productos.filter(p => p.seleccionado).map(p => ({ _id: p._id, stocks: p.stocks }));
    const data = await this.apireports.pdfprintticketsall(seleccionados)
    console.log(data)
    this.openPDFInNewTab(data[0].bin)
  }

  toggleSeleccionarTodos(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.productos.forEach(p => p.seleccionado = checked);
  }

  openPDFInNewTab(pdfBase64:any) {
    const binaryData = atob( pdfBase64);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const byteArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  }
}
