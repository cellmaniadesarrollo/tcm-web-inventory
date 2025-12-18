import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { PdfViewerService } from 'src/app/service/pdf-viewer/pdf-viewer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { serialValidator } from './serial-validator';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormControlName,
  FormArray,
} from '@angular/forms';
import {
  ListitemsincomeI,
  ListdocumentincomeI,
  ListincomesI,
  ListcountriesI,
  ListrimpeI,
  ListsuppliersincomeI,
  ListstatusincomesI,
  ListtaxesnameI,
  ListtaxespercentajeI,
  ListIncomeseditI,
  ListinventorysnamesI,
} from 'src/app/models/income.inteface';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import printJS from 'print-js';

import { SetdataService } from 'src/app/service/setdata/setdata.service';
import { SocketService } from 'src/app/service/socket/socket.service';
import { Subscription } from 'rxjs';
import { DymoserviceService } from 'src/app/service/dymoservice/dymoservice.service';
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
})
export class IncomeComponent {
  @ViewChild('ngselects') ngselect: any;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebutton33') closebutton33: any;
  @ViewChild('closebutton34') closebutton34: any;
  @ViewChild('closebutton1') closebutton1: any;
  serialRules = [
    {
      name: 'CELULAR',
      keywords: ['CELULAR', 'MOVIL', 'SMARTPHONE'],
      requiredLength: 15,
      numericOnly: true
    }

  ];


  serialMessage: string = '';
  constructor(
    private api: ApiService,
    private pdfViewerService: PdfViewerService,
    private router: Router,
    private formBuilder: FormBuilder,
    private socketService: SocketService,
    private apiticketdymmo: DymoserviceService
  ) { }

  numperpagess = [
    { tems: '20', value: '20' },
    { tems: '30', value: '30' },
    { tems: '50', value: '50' },
    { tems: '100', value: '100' },
  ];
  numperpages: any;
  totalentries: any;
  pagination: any;


  filterForm = new FormGroup({
    allclients: new FormControl('0'),
    inventory: new FormControl('0'),
    pagination: new FormControl(1),
    numperpage: new FormControl('30'),
    findlike: new FormControl(''),
  });


  dateformnamesvalue: FormGroup = new FormGroup({
    datestart: new FormControl(''),
    dateend: new FormControl(''),
    id: new FormControl(''),
  });

  incomesaveForm: FormGroup = new FormGroup({
    id_proveedor: new FormControl(null),
    tipo_documento: new FormControl(''),
    numero_documento: new FormControl(''),
    id_item: new FormControl(null),
    cantidad: new FormControl(''),
    precioventa: new FormControl(''),
    fecha: new FormControl(''),
    preciounit: new FormControl(''),
    observaciones: new FormControl(''),
    porcentaje: new FormControl(''),
    inpuesto: new FormControl(''),
    item: new FormControl(''),
    get_print: new FormControl(true),
    iva: new FormControl(true),
    selected_printer: new FormControl(''),
    // 🚨 AGREGAR ESTO
    imeis: this.formBuilder.array([])
  });
  incomeseditForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    numero_documento: new FormControl(''),
    precioventa: new FormControl(''),
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

  items: ListitemsincomeI[] = [];
  typedocument: ListdocumentincomeI[] = [];
  incomeslists: ListincomesI[] = [];
  supplierslist: ListsuppliersincomeI[] = [];
  statusincomes: ListstatusincomesI[] = [];
  taxesnames: ListtaxesnameI[] = [];
  taxespercentaje: ListtaxespercentajeI[] = [];
  typedocumenttext = '';
  namesinventory: ListinventorysnamesI[] = []

  private subscribedChannel: string = 'income';
  private messageSubscription: Subscription | null = null;
  myedit: boolean = true
  ngOnInit(): void {
    // Suscribirse al canal al iniciar el componente
    this.socketService.subscribeToChannel(this.subscribedChannel);
    this.incomesaveForm.get('precioventa')?.valueChanges.subscribe(() => {
      this.calcularPrecioConIva();
    });

    this.incomesaveForm.get('iva')?.valueChanges.subscribe(() => {
      this.calcularPrecioConIva();
    });
    // Suscribirse al observable de mensajes para recibir los mensajes del canal
    this.messageSubscription = this.socketService.message$.subscribe((message) => {
      if (message && message === 'RELOAD') {
        console.log('Received message from channel:', message);
        this.listItems(this.filterForm.value);
      }
    });
    this.listItemsstart(this.filterForm.value);
  }
  ngOnDestroy() {
    // Desuscribirse del canal cuando el componente sea destruido
    this.socketService.unsubscribeFromChannel(this.subscribedChannel);

    // Desuscribir el observable de mensajes
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }



  filterinit(allclients: string, inventory: string, pagination: any, numperpage: string, findlike: any) {
    this.filterForm = this.formBuilder.group({
      allclients: [allclients, Validators.required],
      inventory: [inventory, Validators.required],
      pagination: [pagination, Validators.required],
      numperpage: [numperpage, Validators.required],
      findlike: [findlike],
    })
  }
  onFormChanges(): void {
    // Suscribirse a cambios en todo el formulario
    this.filterForm.valueChanges.subscribe((formValues) => {
      if (
        this.filterForm.get('allclients')?.dirty ||
        this.filterForm.get('inventory')?.dirty ||
        this.filterForm.get('pagination')?.dirty ||
        this.filterForm.get('numperpage')?.dirty
      ) {
        this.loading = true;
        this.listItems(formValues);
        this.loading = false;
      }
    });
  }

  async listItemsstart(form: any) {
    this.loading = true;
    const data = await this.api.listincomesstart(form);
    this.loading = false;
    this.statusincomes = data.statuslist || [];
    this.incomeslists = data.intake;
    this.numperpages = data.number_of_records_per_page;
    this.totalentries = data.number_of_records;
    this.pagination = data.actual_page;
    this.namesinventory = data.inventorys || []
    const findlikeaux = this.filterForm.controls['findlike'].getRawValue();
    const inventoryaux = this.filterForm.controls['inventory'].getRawValue() || '0';
    this.filterinit(data.allclients, inventoryaux, 1, data.number_of_records_per_page.toString(), findlikeaux)
    this.onFormChanges()
  }

  findbutton() {
    this.loading = true;
    this.listItems(this.filterForm.value);
    this.loading = false;
  }
  loading: boolean = true;
  async listItems(form: any) {

    const data = await this.api.listincomes(form);

    this.incomeslists = data.intake;
    this.numperpages = data.number_of_records_per_page;
    this.totalentries = data.number_of_records;
    this.pagination = data.actual_page;
    const findlikeaux = this.filterForm.controls['findlike'].getRawValue();
    const inventoryaux = this.filterForm.controls['inventory'].getRawValue() || '0';
    this.filterinit(data.allclients, inventoryaux, 1, data.number_of_records_per_page.toString(), findlikeaux)
    this.onFormChanges()
    this.myedit = true
    this.loading = false;
  }
  bloquear: boolean = false;
  bloquear1: boolean = false;
  async onSubmitclose(form: any) {
    if (this.isCelular) {
      if (this.imeisArr.length === 0) {
        return;
      }

      for (let imei of this.imeisArr.controls) {
        if (imei.invalid) {
          return;
        }
      }
    }
    this.submitted = true;
    this.bloquear = true;
    this.bloquear1 = true;
    setTimeout(() => {
      this.bloquear = false;
      this.bloquear1 = false;
    }, 2000);
    if (this.incomesaveForm.invalid) {

      // console.log(JSON.stringify(this.nuevoForm.value, null, 2));
      return;
    } else {
      this.myedit = false
      const data = await this.api.saveincome(form);

      if (data == 'OK') {

        this.closebutton.nativeElement.click();
        this.submitted = false;
        this.listItems(this.filterForm.value);
      } else if (data.id) {
        if (data.printer === 'dymo') {
          try {
            this.apiticketdymmo.printTickets(data.id)

          } catch (error) {

          } finally {
            this.closebutton.nativeElement.click();
            this.submitted = false;
            this.listItems(this.filterForm.value);
          }


        } else {
          const params = new URLSearchParams(data.id)
          const url = `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;//`http://localhost:5000/api/printtikets?${params.toString()}`; //`https://82d3-186-69-248-234.ngrok-free.app/api/printtikets?${params.toString()}`;//
          window.open(url, '_blank');
        }
        this.closebutton.nativeElement.click();
        this.submitted = false;
        this.listItems(this.filterForm.value);
      }
    }
  }
  async onSubmitcloseoff(form: any) {
    if (this.isCelular) {
      if (this.imeisArr.length === 0) {
        return;
      }

      for (let imei of this.imeisArr.controls) {
        if (imei.invalid) {
          return;
        }
      }
    }
    this.submitted = true;
    this.bloquear = true;
    this.bloquear1 = true;

    if (this.incomesaveForm.invalid) {

      return;
    } else {
      this.myedit = false
      let data
      try {
        data = await this.api.saveincome(form);
        this.bloquear = false;
        this.bloquear1 = false;
      } catch (error) {
        this.bloquear = false;
        this.bloquear1 = false;
      }

      if (data == 'OK') {
        this.listItems(this.filterForm.value);

        this.terminoDeBusqueda = ''
        this.submitted = false;
        this.incomesaveForm.controls['id_item'].setValue(null);
        this.incomesaveForm.controls['cantidad'].setValue(1);
        this.incomesaveForm.controls['precioventa'].setValue(0);
        this.incomesaveForm.controls['preciounit'].setValue(0);
        this.incomesaveForm.controls['observaciones'].setValue('');
        const imeisArray = this.incomesaveForm.get('imeis') as FormArray;
        imeisArray.clear();
      } else if (data.id) {

        if (data.printer === 'dymo') {
          try {
            this.apiticketdymmo.printTickets(data.id)
          } catch (error) {

          } finally {
            this.listItems(this.filterForm.value);
            this.terminoDeBusqueda = ''
            this.submitted = false;
            this.incomesaveForm.controls['id_item'].setValue(null);
            this.incomesaveForm.controls['cantidad'].setValue(1);
            this.incomesaveForm.controls['precioventa'].setValue(0);
            this.incomesaveForm.controls['preciounit'].setValue(0);
            this.incomesaveForm.controls['observaciones'].setValue('');
            const imeisArray = this.incomesaveForm.get('imeis') as FormArray;
            imeisArray.clear();
          }


        } else {
          const params = new URLSearchParams(data.id)
          const url = `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;//`http://localhost:5000/api/printtikets?${params.toString()}`; //`https://82d3-186-69-248-234.ngrok-free.app/api/printtikets?${params.toString()}`;//
          window.open(url, '_blank');
        }
        this.terminoDeBusqueda = ''
        this.submitted = false;
        this.incomesaveForm.controls['id_item'].setValue(null);
        this.incomesaveForm.controls['cantidad'].setValue(1);
        this.incomesaveForm.controls['precioventa'].setValue(0);
        this.incomesaveForm.controls['preciounit'].setValue(0);
        this.incomesaveForm.controls['observaciones'].setValue('');
        const imeisArray = this.incomesaveForm.get('imeis') as FormArray;
        imeisArray.clear();
      }
    }
  }

  submitted = false;
  get f(): { [key: string]: AbstractControl } {
    return this.incomesaveForm.controls;
  }
  get imeisArr() {
    return this.incomesaveForm.get('imeis') as FormArray;
  }
  addImei() {
    const itemName = this.incomesaveForm.get('item')?.value || '';

    const control = this.formBuilder.control('', [
      Validators.required,
      serialValidator(itemName, this.serialRules)
    ]);

    (this.incomesaveForm.get('imeis') as FormArray).push(control);

    // añadir espacio para el mensaje
    this.imeiMessages.push('');
  }
  imeiMessages: string[] = [];
  onImeiBlur(index: number) {
    const control = (this.incomesaveForm.get('imeis') as FormArray).at(index);

    const errors = control.errors;
    this.imeiMessages[index] = ''; // limpiar mensaje

    if (!errors) {
      this.imeiMessages[index] = 'Serial válido ✔';
      return;
    }

    if (errors['serialLength']) {
      const e = errors['serialLength'];
      this.imeiMessages[index] =
        `Faltan ${e.missing} caracteres (necesita ${e.required}).`;
      return;
    }

    if (errors['serialNumeric']) {
      this.imeiMessages[index] = `Debe ser solo números.`;
      return;
    }
  }
  get imeisFormArray(): FormArray {
    return this.incomesaveForm.get('imeis') as FormArray;
  }
  removeImei(index: number) {
    this.imeisArr.removeAt(index);
  }
  sanitizeImei(index: number) {
    const cleanValue = this.imeisArr.at(index).value.replace(/[^0-9]/g, '');
    this.imeisArr.at(index).setValue(cleanValue, { emitEvent: false });
  }
  onItemChange() {
    const itemName = this.incomesaveForm.get('item')?.value || '';
    const arr = this.incomesaveForm.get('imeis') as FormArray;

    arr.controls.forEach((ctrl, i) => {
      ctrl.setValidators([
        Validators.required,
        serialValidator(itemName, this.serialRules)
      ]);
      ctrl.updateValueAndValidity();
    });

    // limpiar mensajes
    this.imeiMessages = arr.controls.map(() => '');
  }

  isCelular: boolean = false;
  async getdataincome() {
    const user = localStorage.getItem('User');

    this.mostrarSugerencias = false;
    this.blockbusquedapro = false;
    this.bloquear = false;
    this.newproveedor = false;
    this.submitted1 = false;
    const data = await this.api.getdataincome();
    this.typedocument = data.dat;
    this.supplierslist = data.datsup;
    this.taxesnames = data.dattax;
    this.taxespercentaje = data.datpercetax;
    const currentDate = new Date();
    this.isCelular = false;
    this.incomesaveForm.patchValue({
      id_proveedor: null,
      id_item: null,
      tipo_documento: this.typedocument[0]._id,
      numero_documento: '',
      precioventa: 0,
      cantidad: 1,
      preciounit: 0,
      observaciones: '',
      porcentaje: this.taxespercentaje[0]._id,
      inpuesto: data.nametax,
      fecha: formatDate(currentDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US'),
      item: '',
      get_print: true,
      iva: true,
      selected_printer: user && user === 'byronp' ? 'dymo' : 'zebra'
    });
    this.imeisArr.clear();
    this.imeiMessages = [];
    this.typedocumenttext = this.typedocument[0].name_type_document;
  }
  changes() {
    const data = this.incomesaveForm.value.tipo_documento;
    const found = this.typedocument.find((element) => element._id == data);
    this.typedocumenttext = found?.name_type_document;
  }
  totalprice = '';
  totalpriceds() {
    const cant = this.incomesaveForm.controls['cantidad'].getRawValue();
    const preciounit = this.incomesaveForm.controls['preciounit'].getRawValue();
    const idper = this.incomesaveForm.controls['porcentaje'].getRawValue();
    const found = this.taxespercentaje.find(
      (element) => element._id == idper
    )?.percentaje;
    this.totalprice = (
      (parseFloat(found) / 100 + 1) *
      parseFloat(preciounit)
    ).toFixed(2);
  }

  taxestable(datapercentaje: any, datavalue: any) {
    return (
      (parseFloat(datapercentaje) / 100 + 1) *
      parseFloat(datavalue)
    ).toFixed(2);
  }
  taxestabletotal(datapercentaje: any, datavalue: any, dataquanty: any) {
    return (parseFloat(datavalue) * parseFloat(dataquanty)).toFixed(2);
  }
  async findpercentaje() {
    this.taxespercentaje = await this.api.getfindpercentaje(
      this.incomesaveForm.controls['inpuesto'].getRawValue()
    );
    this.incomesaveForm.controls['porcentaje'].setValue(
      this.taxespercentaje[0]._id
    );
  }


  async remo() {
    this.items = this.items = [];
  }

  inicio() {
    this.router.navigate(['dashboard']);
  }
  rimpeitems: ListrimpeI[] = [];
  countriesitems: ListcountriesI[] = [];
  newproveedor = false;
  async nuevoproveedor() {
    if (!this.newproveedor) {
      this.newproveedor = true;
      const datanew = await this.api.getdatanewsupplier();
      this.rimpeitems = datanew.rimpe;
      this.countriesitems = datanew.countries;
      this.supplierForm = this.formBuilder.group({
        RUC: [''],
        razonsocial: [null, Validators.required],
        direccion: [''],
        telefono: [''],
        email: [''],
        rimpe: [
          this.rimpeitems.find((element) => element.name_rimpe == 'NO')?._id,
          Validators.required,
        ],
        pais: [
          this.countriesitems.find(
            (element) => element.name_countrie == 'ECUADOR'
          )?._id,
          Validators.required,
        ],
      });
    } else {
      this.submitted1 = false;
      this.newproveedor = false;
    }
  }
  submitted1 = false;
  get f1(): { [key: string]: AbstractControl } {
    return this.supplierForm.controls;
  }
  async savesupplier(form: any) {
    this.submitted1 = true;

    if (this.supplierForm.invalid) {
      //this.postForm(form);
      // console.log(JSON.stringify(this.nuevoForm.value, null, 2));
      return;
    } else {
      // console.log(form)
      const data = await this.api.savesuppliersincome(form);
      //  console.log(data)
      if (data == 'OK') {
        const data = await this.api.getdataincome();
        this.supplierslist = data.datsup;
        this.newproveedor = false;
        this.submitted1 = false;
      }
    }
  }
  async printreportdocument(id: any) {
    const data = await this.api.reportincomedoument(id);
    Swal.close();
    this.pdfViewerService.openPDFInNewTab(data);
    // printJS({
    //   printable: data,
    //   type: 'pdf',
    //   base64: true,
    //   showModal: true,
    // });
    // console.log(data)
  }
  async printreportdocumentcomplete(id: any) {
    const data = await this.api.reportincomedoumentcomplete(id);
    // console.log(data)
    Swal.close();
    this.pdfViewerService.openPDFInNewTab(data);
    // printJS({
    //   printable: data,
    //   type: 'pdf',
    //   base64: true,
    //   showModal: true,
    // });
    // console.log(data)
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

  renderPage(event: number) {
    this.filterForm.controls['pagination'].setValue(
      event
    );
    this.loading = true;
    this.listItems(this.filterForm.value);
    this.loading = false;
  }



  parseInt1(data: any) {
    return parseInt(data);
  }

  reportsselect(data: any) {
    // this.printreportdocument(data)
    Swal.fire({
      title: 'Imprimir reporte',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Reporte completo',
      denyButtonText: 'Reporte bodega',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      denyButtonColor: '#BF3E23',
      allowOutsideClick: false,
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-3 ',
        confirmButton: 'order-2',
        denyButton: 'order-1',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.simpleAlert();
        this.printreportdocumentcomplete(data);
      } else if (result.isDenied) {
        this.simpleAlert();
        this.printreportdocument(data);
      }
    });
  }
  listincomeditone: ListIncomeseditI = {};
  submittededdit = false;
  get fed(): { [key: string]: AbstractControl } {
    return this.incomeseditForm.controls;
  }
  async editgetdata(data: any) {
    this.submittededdit = false;
    this.listincomeditone = await this.api.getfindedititemincome(data);
    this.incomeseditForm = this.formBuilder.group({
      id: [this.listincomeditone._id, Validators.required],
      numero_documento: [this.listincomeditone.document_info?.document_number, Validators.required],
      precioventa: [
        this.listincomeditone.batch?.unitPrice,
        Validators.required,
      ],
      preciounit: [this.listincomeditone.unit_price, Validators.required],
      observaciones: [this.listincomeditone.observations],
    });
  }
  async editibncomes(data: any) {
    this.submittededdit = true;
    if (this.supplierForm.invalid) {
      return;
    } else {
      this.myedit = false
      const dat = await this.api.editincome(data);
      //  console.log(data)
      if (dat == 'OK') {
        this.submittededdit = false;
        this.closebutton1.nativeElement.click();
        this.listItems(this.filterForm.value);
      }

    }
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
  namevaluereport: any;
  reportnamevalueinit(data: any, name: any) {
    this.namevaluereport = name;
    const currentDate = new Date();
    this.dateformnamesvalue = this.formBuilder.group({
      datestart: [
        formatDate(currentDate, 'yyyy-MM-dd', 'en-US'),
        Validators.required,
      ],
      dateend: [
        formatDate(currentDate, 'yyyy-MM-dd', 'en-US'),
        Validators.required,
      ],
      id: [data, Validators.required],
    });

    // window.open('https://api.whatsapp.com/send?text=Mensaje%20de%0Aprueba', '_blank')
    return;
  }

  async reportnamevalue(data: any) {
    this.closebutton33.nativeElement.click();
    this.simpleAlert();
    const dat = await this.api.reportnamevalue(data);

    Swal.close();
    this.pdfViewerService.openPDFInNewTab(dat);
  }

  terminoDeBusqueda = '';

  mostrarSugerencias = false;
  blockbusquedapro = false;
  loaderpro = false;
  seleccionitem() {
    const data = this.incomesaveForm.controls['id_item'].getRawValue();

    const found = this.items.find((element) => element._id == data);
    this.incomesaveForm.controls['precioventa'].setValue(found?.price);
    this.incomesaveForm.controls['preciounit'].setValue(found?.last_unit_price_income);
  }

  seleccionarSugerencia(texto: string, id_item: string) {
    this.incomesaveForm.controls['id_item'].setValue(id_item);
    this.terminoDeBusqueda = texto;
    this.mostrarSugerencias = false;
    this.seleccionitem()
    this.incomesaveForm.patchValue({
      id_item: id_item,
      item: texto
    });

    // Detectar si es celular
    const isCelular =
      texto.toUpperCase().includes('CELULAR') ||
      texto.toUpperCase().includes('MOVIL') ||
      texto.toUpperCase().includes('SMARTPHONE');

    this.isCelular = isCelular;

    if (isCelular) {
      // Al menos un IMEI requerido
      if (this.imeisArr.length === 0) {
        this.addImei();
      }
    } else {
      // Si no es celular, limpiar IMEIs
      this.imeisArr.clear();
    }
  }
  filtrarSugerencias() {
    this.mostrarSugerencias = this.terminoDeBusqueda.length > 0;
  }
  async makechoice(event: any) {
    if (event.key === 'Enter' || event === 'Enter') {
      if (this.terminoDeBusqueda.length > 2) {
        this.mostrarSugerencias = true;
        this.blockbusquedapro = true;

        setTimeout(() => {
          this.blockbusquedapro = false;
        }, 1000);
        this.loaderpro = true;
        this.items = await this.api.finditemincome(this.terminoDeBusqueda);
        this.loaderpro = false;

      }
    }
    if (this.terminoDeBusqueda.length <= 2) {
      this.incomesaveForm.controls['id_item'].setValue('');
      this.items = [];
    }
  }
  blockbusqueda = false;
  onKeyDownEvent(event: any) {
    if (event.key === 'Enter') {
      if (event.target.value.length > 2) {
        this.blockbusqueda = true;

        setTimeout(() => {
          this.blockbusqueda = false;
        }, 1000);
        this.loading = true;
        this.listItems(this.filterForm.value);
        this.loading = false;
      }
    }
    if (event.target.value.length == 0) {
      this.loading = true;
      this.listItems(this.filterForm.value);
      this.loading = false;
    }
  }

  name1: string = ''
  name2: string = ''
  name3: string = ''
  cantid: string = ''
  qrtext: string = ''
  price: any = null
  printlocalt: any = ''
  ff: any = ''
  ivadat: boolean = false
  modalVisible4: boolean = false;
  async printlocal(id: any, print: any = null) {
    const data = await this.api.ticketsincomes({ id })

    this.name1 = data.topText1
    this.name2 = data.topText2
    this.name3 = data.bottomText1
    this.qrtext = data.qrText
    this.cantid = data.cant
    this.printlocalt = print
    this.price = data.price
    this.ff = data.f
    this.ivadat = data.iva

    this.modalVisible4 = true;
  }
  async closeprintlocal() {
    this.modalVisible4 = false;
  }
  wassapmodal: boolean = false
  openwassapmodal() {
    this.wassapmodal = true
  }
  closewassapmodal() {
    this.wassapmodal = false
  }
  reportpdfmodal: boolean = false
  openreportpdfmodal() {
    this.reportpdfmodal = true
  }
  closereportpdfmodal() {
    this.reportpdfmodal = false
  }




  async aceptar(data: any) {
    //console.log(data)
    Swal.fire({
      title: '¿Cambiar estado a aprobado?',
      text:

        data.quantity +
        ' ' + data.inventory_snapshot.name_model +
        ' ' +
        data.inventory_snapshot.name_item,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aprobado',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.loading = true;
        const asa = await this.api.incomeapproved(data._id);
        if (asa == 'OK') {

          this.listItems(this.filterForm.value);

        }
      }
    });
  }
  precioMostrado: number = 0;
  calcularPrecioConIva() {
    const precioVenta = Number(this.incomesaveForm.get('precioventa')?.value) || 0;
    const tieneIva = this.incomesaveForm.get('iva')?.value;

    if (tieneIva) {
      // Checkbox en TRUE → mismo precio
      this.precioMostrado = precioVenta;
    } else {
      // Checkbox en FALSE → agregar 15%
      this.precioMostrado = +(precioVenta * 1.15).toFixed(2);
    }
  }
  seleccionarTexto(event: Event) {
    const input = event.target as HTMLInputElement;
    input.select();
  }
}
