import { Component } from '@angular/core';
import { CoordinateServiceService } from 'src/app/service/CoordinateService/coordinate-service.service';
import { InventoryTransfersApiService } from 'src/app/service/inventory-transfers-api/inventory-transfers-api.service';
import { Router } from '@angular/router';

export interface Transfer {
  _id: string;
  quantity: number;
  cod: string;
  name: string;
  model: string;
  calidad: string;
  originbranche: string;
  destinationbranche: string;
  status_historyuser: string;
  createuser: string;
  status: string;
  observation: string;
  date:string;
}
@Component({
  selector: 'app-outgoing-transfers',
  templateUrl: './outgoing-transfers.component.html',
  styleUrls: ['./outgoing-transfers.component.css']
})
export class OutgoingTransfersComponent {
  constructor(private backendapi:InventoryTransfersApiService,private coodinates:CoordinateServiceService,private router: Router){}
  datapage = {
    allclients: '0',
    pagination: 1,
    numperpage: '30',
    findlike: '',
  };
  estadoSeleccionado: string = '';
  filtroBusqueda: string = ''; 
  paginaActual = 1;
  paginas = [1, 2, 3]; // Generar dinámicamente según total
  estados: string[] = ['Pendiente', 'Aprobado', 'Rechazado'];
  
  transacciones:Transfer []=[] 
  ngOnInit(){
    this.buscar() 
  }
 async buscar() {
    // Aquí se llama al backend con datapage
    const data=await this.backendapi.listitem({data:this.datapage,coodinates:await this.getcoodinates()})
    this.transacciones=data.data 
    console.log(data.data )
    // Tu servicio llamaría al backend y llenaría `transacciones` y `paginas`
  }
  
  limpiarBusqueda() {
    this.datapage.findlike = '';
    this.buscar();
  }
  
  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.paginas.length) {
      this.datapage.pagination = pagina;
      this.buscar();
    }
  }
 
  
  nuevaSolicitud() {
    // tu lógica
  }
  async getcoodinates() {
    return await this.coodinates.obtenerUbicacion()
  }
 
}
