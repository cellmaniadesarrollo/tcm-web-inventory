import { Component } from '@angular/core';
import { CoordinateServiceService } from 'src/app/service/CoordinateService/coordinate-service.service';
import { InventoryTransfersApiService } from 'src/app/service/inventory-transfers-api/inventory-transfers-api.service';
import { Router } from '@angular/router';
import { UbicacionCompartidaService } from 'src/app/service/ubicacion-compartida/ubicacion-compartida.service';
import { Subscription } from 'rxjs';
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
  date: string;
}
@Component({
  selector: 'app-outgoing-transfers',
  templateUrl: './outgoing-transfers.component.html',
  styleUrls: ['./outgoing-transfers.component.css']
})
export class OutgoingTransfersComponent {
  private subscriptions: Subscription = new Subscription();
  constructor(private backendapi: InventoryTransfersApiService, 
     private router: Router, private ubicacionService: UbicacionCompartidaService) { }
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
  ubicasion: any = ''
  transacciones: Transfer[] = []
  ngOnInit() {
    this.subscriptions.add(
      this.ubicacionService.coordenadas$.subscribe(coords => {
        this.ubicasion = coords
        if (this.ubicasion &&
          this.ubicasion !== '' &&
          this.ubicasion.latitud &&
          this.ubicasion.longitud &&
          this.ubicasion.latitud !== 0 &&
          this.ubicasion.longitud !== 0) {
          this.buscar();
        }
      })
    );
  }
  async buscar() {
    // Aquí se llama al backend con datapage
    const data = await this.backendapi.listitem({ data: this.datapage, coodinates: this.ubicasion })
    this.transacciones = data.data 
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

}
