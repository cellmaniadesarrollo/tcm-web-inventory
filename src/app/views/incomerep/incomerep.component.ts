import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  ListitemsincomeI,
  ListdocumentincomeI,
  ListincomesI,
  ListcountriesI,
  ListrimpeI,
  ListsuppliersincomeI,
  ListstatusincomesI,
} from 'src/app/models/income.inteface';

import { SocketService } from 'src/app/service/socket/socket.service';
import { Subscription } from 'rxjs';
import { SetdataService } from 'src/app/service/setdata/setdata.service';
@Component({
  selector: 'app-incomerep',
  templateUrl: './incomerep.component.html',
  styleUrls: ['./incomerep.component.css'],
})
export class IncomerepComponent {
  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private socketService: SocketService,
    private setdataService: SetdataService 
  ) { }
  datapage = {
    allclients: '0',
    pagination: 1,
    numperpage: '30',
    findlike: '',
    findid:false
  };
  numperpagess = [
    { tems: '20', value: '20' },
    { tems: '30', value: '30' },
    { tems: '50', value: '50' },
    { tems: '100', value: '100' },
  ];
  numperpages: any;
  totalentries: any;
  numperpagesForm = new FormGroup({
    valueperpage: new FormControl(''),
  });
  searchForm = new FormGroup({
    valuesearch: new FormControl(''),
  });
  stateincomesform: FormGroup = new FormGroup({
    stateincome: new FormControl(''),
  });
  incomesaveForm: FormGroup = new FormGroup({
    id_proveedor: new FormControl(null),
    tipo_documento: new FormControl(''),
    numero_documento: new FormControl(''),
    id_item: new FormControl(null),
    cantidad: new FormControl(''),
    fecha: new FormControl(''),
    preciounit: new FormControl(''),
    observaciones: new FormControl(''),
  });
  supplierForm: FormGroup = new FormGroup({
    RUC: new FormControl(''),
    razonsocial: new FormControl(''),
    direccion: new FormControl(''),
    telefono: new FormControl(''),
    email: new FormControl(''),
    rimpe: new FormControl(''),
    pais: new FormControl(''),
  });

  private subscribedChannel: string = 'income';
  private messageSubscription: Subscription | null = null;
  ngOnInit(): void {
    // Suscribirse al canal al iniciar el componente
    this.socketService.subscribeToChannel(this.subscribedChannel);

    // Suscribirse al observable de mensajes para recibir los mensajes del canal
    this.messageSubscription = this.socketService.message$.subscribe((message) => {
      if (message && message === 'RELOAD') {
        this.listItems(this.datapage);
      }
    });
    let serverid =  this.setdataService.getData();
    if (serverid !== null &&serverid !==undefined&& serverid.length == 29) {
      this.datapage.findlike = serverid.toUpperCase(); 
    } else if(serverid !== null &&serverid !==undefined&& serverid.length == 24){
      this.datapage.findid=true
      this.datapage.findlike = serverid
    } 
    this.listItems(this.datapage);
    
    // this.getdataincome();
    // this.makechoice('')
    this.numperpagesForm.setValue({
      valueperpage: this.numperpagess[1].tems,
    });
  }
  ngOnDestroy() {
    // Desuscribirse del canal cuando el componente sea destruido
    this.socketService.unsubscribeFromChannel(this.subscribedChannel);

    // Desuscribir el observable de mensajes
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
  blockbusqueda = false
  onKeyDownEvent(event: any) {
    if (event.key === 'Enter') {
      if (event.target.value.length > 2) {
        this.blockbusqueda = true

        setTimeout(() => {
          this.blockbusqueda = false
        }, 1000);
        this.datapage.findlike = event.target.value;
        this.datapage.pagination = 1;
        this.loading = true;
        this.listItems(this.datapage);
        this.loading = false;
      }
    }
    if (event.target.value.length == 0) {
      this.datapage.findlike = event.target.value;
      this.datapage.pagination = 1;
      this.loading = true;
      this.listItems(this.datapage);
      this.loading = false;
    }
  }

  finditemincome = '';
  items: ListitemsincomeI[] = [];
  typedocument: ListdocumentincomeI[] = [];
  incomeslists: ListincomesI[] = [];
  supplierslist: ListsuppliersincomeI[] = [];
  statusincomes: ListstatusincomesI[] = [];
  typedocumenttext = '';
  findbutton() {
    this.datapage.findlike = this.searchForm.value.valuesearch || '';
    this.datapage.pagination = 1;
    this.loading = true;
    this.listItems(this.datapage);
  }
  loading: boolean = true;
  async listItems(form: any) {

    const data = await this.api.listincomesCSRS(form);

    this.statusincomes = data.statuslist || [];
    this.incomeslists = data.intake;
    this.numperpages = data.number_of_records_per_page;
    this.totalentries = data.number_of_records;
    this.datapage.allclients = data.allclients;
    this.datapage.pagination = data.actual_page;
    this.stateincomesform.controls['stateincome'].setValue(
      this.datapage.allclients
    );
    if(this.datapage.findid){
      this.datapage.findid=false
    }
    this.loading = false;
    // console.log(this.incomeslists)
  }
  async changeLeagueOwner() {
    this.datapage.allclients = this.stateincomesform.value.stateincome;
    this.datapage.pagination = 1;
    this.loading = true;
    this.listItems(this.datapage);

  }

  async aceptar(data: any) {
    Swal.fire({
      title: '¿Cambiar estado a aprobado?',
      text:
        data.quantity +
        ' ' +
        data.inventoryflow.modelitem +
        ' ' +
        data.inventoryflow.nameitem,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aprobado',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const asa = await this.api.incomeapproved(data._id);
        if (asa == 'OK') {
          this.loading = true;
          this.listItems(this.datapage);
          this.loading = false;
        }
      }
    });
  }
  async NOaceptar(data: any) {
    Swal.fire({
      title: '¿Cambiar estado a rechazado?',
      text:
        data.quantity +
        ' ' +
        data.inventoryflow.modelitem +
        ' ' +
        data.inventoryflow.nameitem,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Rechazado',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const asa = await this.api.incomedesapproved(data._id);
        if (asa == 'OK') {
          this.loading = true;
          this.listItems(this.datapage);
          this.loading = false;
        }
      }
    });
  }
  datacolor(data: any) {
    switch (data) {
      case 'RECHAZADO':
        return 'table-danger';
      case 'APROBADO':
        return 'table-success';
    }
    return '';
  }
  updateSortingperpage() {
    this.datapage.numperpage = this.numperpagesForm.value.valueperpage || '15';
    this.datapage.pagination = 1;
    this.loading = true;
    this.listItems(this.datapage);
    this.loading = false;
  }
  renderPage(event: number) {
    this.datapage.pagination = event;
    this.loading = true;
    this.listItems(this.datapage);
    this.loading = false;
  }
  inicio() {
    this.router.navigate(['dashboard']);
  }
}
