import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import printJS from 'print-js';
import { SetdataService } from 'src/app/service/setdata/setdata.service';
import {
  Listmovementsitem,
  Listincomeshistory,
  ListitemsI,
  ListbrandI,
  ListmodelI,
  ListcolorI,
  ListtypeI,
  ListqualityI,
  ListstateproductI,
  ListsweightI,
  ListsvolumeI,
  ListsstateinventoryI,
  ListscomesfromI,
  Getoneitem,
} from 'src/app/models/item.inteface';
import { SocketService } from 'src/app/service/socket/socket.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-inventoryper',
  templateUrl: './inventoryper.component.html',
  styleUrls: ['./inventoryper.component.css'],
})
export class InventoryperComponent {
  constructor(private router: Router, private api: ApiService, private setdataService: SetdataService ,private socketService: SocketService ) {}
  items: ListitemsI[] = [];
  stateproducts: ListstateproductI[] = [];
  pdfbase64s: any;
  totalentries: any;
  numperpages: any;
  numperpagess = [
    { tems: 20, value: '20' },
    { tems: 30, value: '30' },
    { tems: 50, value: '50' },
    { tems: 100, value: '100' },
  ];

  datapage = {
    allclients: '0',
    pagination: 1,
    numperpage: 30,
    findlike: '',
  };
  private subscribedChannel: string = 'invper';
  private messageSubscription: Subscription | null = null;
  ngOnInit(): void {
    // Suscribirse al canal al iniciar el componente
    this.socketService.subscribeToChannel(this.subscribedChannel);

    // Suscribirse al observable de mensajes para recibir los mensajes del canal
    this.messageSubscription = this.socketService.message$.subscribe((message) => {
      if (message && message === 'RELOAD') {
        console.log('Received message from channel:', message);
        this.listItems(this.datapage);
      }
    });


    this.listItems(this.datapage);
    let serverid =  this.setdataService.getData();
    if (serverid !== null &&serverid !==undefined&& serverid.length == 29) {
      this.datapage.findlike = serverid.toUpperCase(); 
      this.loading = true;
      this.listItems(this.datapage) 
      this.loading = false;
    } else { 
      this.loading = true;
      this.listItems(this.datapage) 
      this.loading = false;
    }
  }

  ngOnDestroy() {
    // Desuscribirse del canal cuando el componente sea destruido
    this.socketService.unsubscribeFromChannel(this.subscribedChannel);

    // Desuscribir el observable de mensajes
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  loading: boolean = true; 
 
  Changeserarch(event:any){ 
    if (event.key === 'Enter'||event=='' ) { 
      this.datapage.pagination=1
      this.loading = true;
      this.listItems(this.datapage) 
      this.loading = false;
  }
  }
  Change(){     
    this.datapage.pagination=1
    this.loading = true;
    this.listItems(this.datapage) 
    this.loading = false;
  }
  renderPage(event:any){
    this.datapage.pagination=event 
    this.loading = true;
    this.listItems(this.datapage) 
    this.loading = false;
  }
  async listItems(form: any) {
    
    const data = await this.api.listitemsper(form);
    
    this.stateproducts = data.stateproduct;
    this.items = data.intake;
    this.numperpages = data.number_of_records_per_page;
    this.totalentries = data.number_of_records;
    this.datapage.allclients = data.allclients;
    this.datapage.pagination = data.actual_page;
 
  }
  datacolor(data: any) {
    switch (data) {
      case 0:
        return 'table-danger';
      case 'REPARACION':
        return 'table-primary';
      case 1:
        return 'table-warning';
    }
    return '';
  }

  newoinventoryrep() {
    this.router.navigate(['inventorypernew']);
  }

  inicio() {
    this.router.navigate(['dashboard']);
  }

  async simpleAlert() {
    Swal.fire({
      title: '',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  idtit: string = '';
  canti: string = '';
  name:string='';

  async print(data: any, can: any) {
    this.idtit = data;
    this.canti = can;
    this.modalVisible3 = true;
  }
  name1:string=''
  name2:string=''
  name3:string=''
  cantid:string=''
  async printlocal(n1: any,n2:any,n3:any, can: any) {
    this.name1=n1
    this.name2=n2
    this.name3=n3
    this.cantid=can
    this.modalVisible4 = true;
  }
  async closeprintlocal( ) {
    this.modalVisible4 = false;
  }
  modalVisible3: boolean = false;
  modalVisible4: boolean = false;
  modalVisible: boolean = false;
  openModaltype() {
    this.modalVisible3 = true;
  }
  closeModaltype(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible3 = false;
    }
  }
  openModaloptions(name:any,id:any) {
    this.name=name
    this.idtit=id
    this.modalVisible = true;
  }
  closeModaloptions(event: { data: any }) { 
    if (event.data.close) {
     if( event.data.data.reload){
      this.listItems(this.datapage);
     }
      this.modalVisible = false;
    }
  } 
}
