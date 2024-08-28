import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { TokencheckService } from '../../service/tokencheck/tokencheck.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { Renderer2 } from '@angular/core';

import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import printJS from 'print-js';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { formatDate } from '@angular/common';
import {
  MovementnameI,
  MovementsI,
  TechnicianeMoveI,
  MovementtypeI,
} from 'src/app/models/movements.interface';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css'],
})
export class MovementsComponent {
  @ViewChild('closebutton') closebutton: any;
  datapage = {
    allclients: '0',
    alltypes: '0',
    pagination: 1,
    numperpage: '30',
    findlike: '',
  };
  totalentries: any;
  numperpages: any;
  numperpagess = [
    { tems: '20', value: '20' },
    { tems: '30', value: '30' },
    { tems: '50', value: '50' },
    { tems: '100', value: '100' },
  ];
  typesmovements: MovementnameI[] = [];
  typestypemovements: MovementtypeI[] = [];
  movements: MovementsI[] = [];
  constructor(
    private activerouter: ActivatedRoute,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private api: ApiService,
    private router: Router,
    private tokenstate: TokencheckService,
    public readonly swalTargets: SwalPortalTargets,
    private formBuilder: FormBuilder
  ) {}

  devolucionForm: FormGroup = new FormGroup({
    id_item: new FormControl(''),
    codigo_movimiento: new FormControl(''),
    tipo_devolucion: new FormControl(null),
    numero_orden: new FormControl(''),
    cantidad: new FormControl(''),
    recibe_de: new FormControl(null),
    observaciones: new FormControl(''),
    fecha: new FormControl(new Date()),
  });
  searchForm = new FormGroup({
    valuesearch: new FormControl(''),
  });
  editmovementForm = new FormGroup({
    _id: new FormControl(''),
    observations: new FormControl(''),
  });
  numperpagesForm = new FormGroup({
    valueperpage: new FormControl(''),
  });
  namemovementform: FormGroup = new FormGroup({
    name_movement: new FormControl(''),
  });
  typemovementform: FormGroup = new FormGroup({
    type_movement: new FormControl(''),
  });
  blockbusqueda = false;
  onKeyDownEvent(event: any) {
    this.datapage.findlike = this.searchForm.value.valuesearch || '';
    if (event.key === 'Enter') {
      if (event.target.value.length > 2) {
        this.blockbusqueda = true;

        setTimeout(() => {
          this.blockbusqueda = false;
        }, 1000);
        this.datapage.pagination = 1;
        this.listmovements(this.datapage);
      }
    }
    if (event.target.value.length == 0) {
      this.datapage.pagination = 1;
      this.listmovements(this.datapage);
    }
    //  console.log(event.target.value.length)
  }
  ngOnInit(): void {
    let serverid = this.activerouter.snapshot.paramMap.get('id');
    if (serverid != null && serverid.length == 36) {
      this.datapage.findlike = serverid.toUpperCase();
      this.listmovements(this.datapage);

      this.typestypemovementslist();
      this.numperpagesForm.setValue({
        valueperpage: this.numperpagess[1].tems,
      });
    } else {
      this.listmovements(this.datapage);

      this.typestypemovementslist();
      this.numperpagesForm.setValue({
        valueperpage: this.numperpagess[1].tems,
      });
    }
  }
  log = '';
  async keycomp(data: any) {
    this.log = this.log + data.replace("'", '-');

    await this.delay(100);

    if (this.log.length == 36) {
      this.datapage.findlike = this.log.toUpperCase();
      this.listmovements(this.datapage);
    }
    await this.delay(100);
    this.log = '';
  }

  async typesmovementslist(data: any) {
    this.typesmovements = await this.api.movementyepesmovements(data);
  }
  async typestypemovementslist() {
    this.typestypemovements = await this.api.movementyepestypemovements();
    this.typesmovementslist(this.datapage.alltypes);
  }
  findbutton() {
    this.datapage.findlike = this.searchForm.value.valuesearch || '';
    this.datapage.pagination = 1;
    this.listmovements(this.datapage);
  }
  loading: boolean = true;
  async listmovements(datain: any) {
    this.loading = true;
    const data = await this.api.listmovements(datain);
    this.loading = false;
    this.movements = data.intake;
    this.numperpages = data.number_of_records_per_page;
    this.totalentries = data.number_of_records;
    this.datapage.allclients = data.allclients;
    this.datapage.pagination = data.actual_page;
    this.datapage.alltypes = data.alltypes;
    this.namemovementform.controls['name_movement'].setValue(
      this.datapage.allclients
    );
    this.typemovementform.controls['type_movement'].setValue(
      this.datapage.alltypes
    );
  }

  async changeLeagueOwner() {
    this.datapage.allclients = this.namemovementform.value.name_movement;

    this.datapage.pagination = 1;
    this.listmovements(this.datapage);
  }
  async changeLeagueOwnertype() {
    this.datapage.alltypes = this.typemovementform.value.type_movement;
    this.datapage.allclients = '0';
    this.typesmovementslist(this.datapage.alltypes);
    this.datapage.pagination = 1;
    this.listmovements(this.datapage);
  }

  updateSortingperpage() {
    this.datapage.numperpage = this.numperpagesForm.value.valueperpage || '15';
    this.datapage.pagination = 1;
    this.listmovements(this.datapage);
  }
  renderPage(event: number) {
    //  console.log(event);
    this.datapage.pagination = event;
    this.listmovements(this.datapage);
  }
  technicians: TechnicianeMoveI[] = [];
  ins: MovementnameI[] = [];
  maxvalue: String = '';
  minvalue: String = '1';
  async findonemovement(datag: any) {
    this.editar = false;
    this.detalles = false;
    this.salida = false;
    this.itemdataedit = datag;
    this.devoluciones = false;
    this.active = 1;
    this.salidas();
  }
  submittedoutmovement = false;
  async savemovementreturn() {
    this.submittedoutmovement = true;
    if (this.devolucionForm.invalid) {
      // console.log(JSON.stringify(this.salidaForm.value, null, 2));
      return;
    } else {
      const data = await this.api.movementreturnsave(this.devolucionForm.value);
      if (data == 'OK') {
        this.listmovements(this.datapage);
        this.closebutton.nativeElement.click();
        this.submittedoutmovement = false;
      }
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.devolucionForm.controls;
  }
  datacolor(data: any) {
    switch (data) {
      case 'DAÑADO':
        return 'table-danger';
      case 'REPARACION':
        return 'table-primary';
      case 'INCOMPATIVILIDAD':
        return 'table-warning';
      case 'VENTA':
        return 'table-success';
      case 'NO REQUERIDO':
        return 'table-secondary';
      case 'RECICLAJE':
        return 'table-info';
      case 'DAÑO ACCIDENTE':
        return 'table-dark';
      default:
        return 'table-light';
    }
  }
  active = 1;
  salida = false;
  editar = false;
  detalles = false;

  async salidas() {
    this.submittedoutmovement = false;

    this.submittedoutmovement = false;
    const data = await this.api.movementgetonemovement(this.itemdataedit);

    if (data) {
      this.detalles = false;
      this.editar = false;
      this.salida = true;
      this.devoluciones = true;
      const currentDate = new Date();
      this.maxvalue = data.movementget.maxdev.toString();
      var numOrder;
      try {
        numOrder = data.movementget.numorder.numorders;
      } catch (error) {
        numOrder = '';
      }

      this.devolucionForm = this.formBuilder.group({
        id_item: [data.movementget.id_item, Validators.required],
        codigo_movimiento: [
          data.movementget.uuid_movement._id,
          [Validators.required],
        ],
        tipo_devolucion: [null, Validators.required],
        numero_orden: [numOrder],
        cantidad: [
          this.functionvalue(data.movementget.maxdev),
          Validators.required,
        ],
        recibe_de: [data.movementget.id_user_recipient, Validators.required],
        observaciones: [''],
        fecha: [
          formatDate(currentDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US'),
          Validators.required,
        ],
      });
      console.log(data);
      this.ins = data.ins;
      this.technicians = data.technician;
    } else {
      this.active = 2;
      this.devoluciones = false;
      this.detallesin();
    }
  }
  devoluciones = false;
  itemdataedit = '';
  detailsdata: MovementsI = {};
  sendid(data: any) {
    this.itemdataedit = data;
  }
  async detallesin() {
    this.salida = false;
    this.editar = false;
    this.detalles = true;
    this.detailsdata = await this.api.getonemovementdetaildata(
      this.itemdataedit
    );
    // console.log(this.detailsdata);
    // this.listdata();
  }
  async editcoment() {
    this.salida = false;
    this.detalles = false;
    this.editar = true;
    this.detailsdata = await this.api.getonemovementeditdata(this.itemdataedit);
    this.editmovementForm.setValue({
      _id: this.itemdataedit,
      observations: this.detailsdata.observations_movement,
    });

    await this.renderer.selectRootElement('#myInput').focus();
  }
  async savemovementedit() {
    const data = await this.api.movementeditsave(this.editmovementForm.value);
    if (data == 'OK') {
      this.listmovements(this.datapage);
      this.closebutton.nativeElement.click();
    }
  }
  functionvalue(data: any) {
    if (data == 0) {
      this.minvalue = '0';
      return 0;
    } else {
      this.minvalue = '1';
      return 1;
    }
  }

    obtenerFechaHace6Dias(): string {
    // Obtener la fecha actual
    let fechaActual = new Date();
  
    // Restar 7 días a la fecha actual
    fechaActual.setDate(fechaActual.getDate() - 6);
  
    // Formatear la fecha resultante
    let fechainit = formatDate(fechaActual, 'yyyy-MM-dd', 'en-US');
  
    return fechainit;
  }
 

  fechainit=formatDate(new Date() , 'yyyy-MM-dd', 'en-US');
  fechafin =formatDate(new Date() , 'yyyy-MM-dd', 'en-US'); 
  datareset(){
    this.fechainit =  this.obtenerFechaHace6Dias() ;
    this.fechafin = formatDate(new Date() , 'yyyy-MM-dd', 'en-US');
  }
  async reportemovimientos() {
    let dat = { datestart: this.fechainit, dateend: this.fechafin };
    //this.closebutton34.nativeElement.click();
    this.simpleAlert();
    const datt = await this.api.reportmovements(dat);
    Swal.close();
    this.openPDFInNewTab(datt);
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
  openPDFInNewTab(pdfBase64: any) {
    const binaryData = atob(pdfBase64);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const byteArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  }
  inicio() {
    this.router.navigate(['dashboard']);
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
