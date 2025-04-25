import { Component } from '@angular/core';
import { CoordinateServiceService } from 'src/app/service/CoordinateService/coordinate-service.service';
import { InventoryTransfersApiService } from 'src/app/service/inventory-transfers-api/inventory-transfers-api.service';
import { UbicacionCompartidaService } from 'src/app/service/ubicacion-compartida/ubicacion-compartida.service';
import Swal from 'sweetalert2';
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
  datechange:string;
}
export interface Status {
  id: string;
  name: string;
}
@Component({
  selector: 'app-receiving-transfers',
  templateUrl: './receiving-transfers.component.html',
  styleUrls: ['./receiving-transfers.component.css']
})
export class ReceivingTransfersComponent {
  private subscriptions: Subscription = new Subscription();
  constructor(private backendapi: InventoryTransfersApiService , private ubicacionService: UbicacionCompartidaService) { }
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
  estados: Status[] = [];
  ubicasion: any = ''
  transacciones: Transfer[] = []
  totalentries: any;
  isLoading = true;
  ngOnInit() {
    this.subscriptions.add(
      this.ubicacionService.coordenadas$.subscribe(coords => {
        this.ubicasion=coords
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
  renderPage(event:any){
    this.datapage.pagination=event  
    this.buscar()
  }
  async buscar() {
    this.isLoading = true;
    const data = await this.backendapi.incomelistitem({ data: this.datapage, coodinates: this.ubicasion })
    this.transacciones = data.items.data
    this.estados = data.status
    this.totalentries=data.items.pagination.total 
    this.isLoading = false;
    // Tu servicio llamaría al backend y llenaría `transacciones` y `paginas`
  }

  limpiarBusqueda() {
    this.datapage.findlike = '';
    this.buscar();
  }
 
  aprobar(id: string) {
    Swal.fire({
      title: '¿Estás seguro de aprobar?',
      input: 'text',
      inputLabel: 'Observaciones (opcional)',
      inputPlaceholder: 'Puedes dejar una observación',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const observacion = result.value || '';
        try {
          const res = await this.backendapi.incomeacept({ id: id, observacion: observacion })

          Swal.fire('¡Aprobado!', 'La transacción ha sido aprobada.', 'success');
          this.buscar();
        } catch (error) {
          console.error('Error al aprobar la transacción:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al aprobar la transacción. Intenta nuevamente.',
          });
        }


      }
    });
  }


  rechazar(id: string) {
    Swal.fire({
      title: '¿Estás seguro de rechazar?',
      input: 'text',
      inputLabel: 'Motivo de rechazo',
      inputPlaceholder: 'Escribe una observación',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes escribir el motivo de rechazo';
        }
        return null;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const observacion = result.value;
        try {
          const res = await this.backendapi.incomedecline({ id: id, observacion: observacion })

          Swal.fire('Rechazado', 'La transacción ha sido rechazada.', 'error');
          this.buscar();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al rechazar la transacción. Intenta nuevamente.',
          });
        }

      }
    });
  }
}
