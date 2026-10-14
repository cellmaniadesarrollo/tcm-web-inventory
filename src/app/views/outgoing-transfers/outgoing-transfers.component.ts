import { Component } from '@angular/core';
import { CoordinateServiceService } from 'src/app/service/CoordinateService/coordinate-service.service';
import { InventoryTransfersApiService } from 'src/app/service/inventory-transfers-api/inventory-transfers-api.service';
import { Router } from '@angular/router';
import { UbicacionCompartidaService } from 'src/app/service/ubicacion-compartida/ubicacion-compartida.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { QrScannerModalComponent } from 'src/app/shared/qr-scanner-modal/qr-scanner-modal.component';

export interface Transfer {
  _id: string;
  quantity: number;

  cod: string;
  name: string;
  model: string;
  calidad: string;

  originbranche: string;
  destinationbranche: string;

  createuser: string;
  date: string; // fecha de creación

  status_history: TransferStatusHistory[];
}
export interface TransferStatusHistory {
  status_name: string;
  observation: string | null;
  user: string;
  date: string; // ISO string
}
export interface Status {
  id: string;
  name: string;
}
@Component({
  selector: 'app-outgoing-transfers',
  templateUrl: './outgoing-transfers.component.html',
  styleUrls: ['./outgoing-transfers.component.css']
})
export class OutgoingTransfersComponent {
  private subscriptions: Subscription = new Subscription();
  constructor(private backendapi: InventoryTransfersApiService, 
    private router: Router, private ubicacionService: UbicacionCompartidaService,
    private dialog: MatDialog) { }
  datapage = {
    allclients: '0',
    pagination: 1,
    numperpage: '30',
    findlike: '',
  };
  isLoading = true;
  totalentries: any;
  estadoSeleccionado: string = '';
  filtroBusqueda: string = '';
  paginaActual = 1;
  paginas = [1, 2, 3]; // Generar dinámicamente según total
   estados: Status[] = [];
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
  renderPage(event:any){
    this.datapage.pagination=event  
    this.buscar()
  }
  async buscar() {
    // Aquí se llama al backend con datapage
    this.isLoading = true;
    const data = await this.backendapi.listitem({ data: this.datapage, coodinates: this.ubicasion })
    this.transacciones = data.items.data
    this.estados = data.status
    this.totalentries=data.items.pagination.total 
    this.isLoading = false
    // Tu servicio llamaría al backend y llenaría `transacciones` y `paginas`
  }

  limpiarBusqueda() {
    this.datapage.findlike = '';
    this.buscar();
  } 


  nuevaSolicitud() {
    // tu lógica
  } 

  openQrScanner(): void {
    this.dialog
      .open(QrScannerModalComponent, {
        width: '420px',
        maxWidth: '95vw',
        autoFocus: false
      })
      .afterClosed()
      .subscribe((text?: string) => {
        if (!text) return;
        this.datapage.findlike = text.trim();
        this.datapage.pagination = 1;
        this.buscar();
      });
  }
}
