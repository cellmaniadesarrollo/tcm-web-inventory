import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TokencheckService } from '../../service/tokencheck/tokencheck.service';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { Renderer2 } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
//import { ListitemsI, ListstateproductI } from 'src/app/models/item.inteface';
import printJS from 'print-js';
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

import {
  TechnicianeMoveI,
  MovementnameI,
  UsersMoveI
} from 'src/app/models/movements.interface';
import { DatePipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { formatDate } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';

import { SetdataService } from 'src/app/service/setdata/setdata.service';
import { SocketService } from 'src/app/service/socket/socket.service';
import { Subscription } from 'rxjs';
declare var window: any;
declare var dymo: any;
 
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent {
 // socket: WebSocketSubject<any> = new WebSocketSubject('ws://localhost:3000');
  @ViewChild('closebutton') closebutton: any;
 
  active = 1;
  datapage = {
    allclients: '0',
    pagination: 1,
    numperpage: '30',
    findlike: '',
  };
  pdfbase64s: any;
  totalentries: any;
  numperpages: any;
  numperpagess = [
    { tems: '20', value: '20' },
    { tems: '30', value: '30' },
    { tems: '50', value: '50' },
    { tems: '100', value: '100' },
  ];
 
  submitted = false;
  constructor(
    private setdataService: SetdataService , 
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private api: ApiService,
    private router: Router,
    private tokenstate: TokencheckService,
    public readonly swalTargets: SwalPortalTargets,
    private formBuilder: FormBuilder,  
    private socketService: SocketService
  ) { 
   
  }

 

  items: ListitemsI[] = [];
  numperpagesForm = new FormGroup({
    valueperpage: new FormControl(''),
  });
  searchForm = new FormGroup({
    valuesearch: new FormControl(''),
  });
  stateproductform: FormGroup = new FormGroup({
    stateproduct_inventoryflow: new FormControl(''),
  });
  stateproducts: ListstateproductI[] = [];
 
  nivel2 = false;
  getdata:any; 
  private subscribedChannel: string = 'invfl';
  private messageSubscription: Subscription | null = null;  
  myedit:boolean=true
  ngOnInit(): void { 
// Suscribirse al canal "news"
this.socketService.subscribeToChannel(this.subscribedChannel);

// Suscribirse al observable de mensajes para almacenar el mensaje recibido
this.messageSubscription = this.socketService.message$.subscribe((message) => {
  if (message && message==="RELOAD"&& this.myedit) { 
    console.log('Message stored in component:', message);
    this.listItems(this.datapage);
  }
});

    const group = localStorage.getItem('Groups') || '';
    this.nivel2 = group
      .split(',')
      .some((x: any) => x == 'IFE' || x == 'ADMINS');
 

    // window.addEventListener('keypress', (event: any) => {
    //   this.keycomp(event.key);
    // });

   


    let serverid =  this.setdataService.getData();
    if (serverid !== null &&serverid !==undefined&& serverid.length == 29) {
      this.datapage.findlike = serverid.toUpperCase();
      this.tokenstate.checkLocalStorage();
      this.listItems(this.datapage);
      this.numperpagesForm.setValue({
        valueperpage: this.numperpagess[1].tems,
      });
    } else {
      this.tokenstate.checkLocalStorage();
      this.listItems(this.datapage);
      this.numperpagesForm.setValue({
        valueperpage: this.numperpagess[1].tems,
      });
    }
  }
  ngOnDestroy(): void { 
    this.socketService.unsubscribeFromChannel(this.subscribedChannel); 
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    } 
      this.socketService.closeConnection();
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
findbutton(){
  this.datapage.findlike = this.searchForm.value.valuesearch || '';
  this.datapage.pagination = 1;
  this.listItems(this.datapage);
}
loading: boolean = true;
  async listItems(form: any) {
    //this.loading = true;
    const data = await this.api.listitems(form);
    this.loading = false;
    this.stateproducts = data.stateproduct;
    this.items=data.intake 
    this.numperpages = data.number_of_records_per_page;
    this.totalentries = data.number_of_records;
    this.datapage.allclients = data.allclients;
    this.datapage.pagination = data.actual_page; 
    this.stateproductform.controls['stateproduct_inventoryflow'].setValue(
      this.datapage.allclients
    );
   // console.log(data)
  }

  async print(data: any) {
    // printJS({printable:'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf', type:'pdf', showModal:true})
    // printJS({printable:this.pdfbase64s, type:'pdf', showModal:true})
    this.simpleAlert();
    const dataget = await this.api.getpdfbase64(data);

    printJS({
      printable: dataget.pdfbase64,
      type: 'pdf',
      base64: true,
      showModal: true,
    });
    Swal.close();
  }

  async print2(data: any) {
    const dataget = await this.api.getxmlticket(data);
    var printers = dymo.label.framework.getPrinters();
    if (printers.length == 0)
      throw 'No DYMO printers are installed. Install DYMO printers.';

    dymo.label.framework
      .getPrintersAsync()
      .then(function (printers: any) {
        // Successful result, printers variable has a list of all supported by the DYMO Label Framework
        console.log(printers);
      })
      .thenCatch(function (error: any) {
        // Error
      });

    var labelXml = dataget.xml.toString();
    //console.log(labelXml)
    var label = dymo.label.framework.openLabelXml(labelXml);
    //label.setObjectText("BARCODE", '000220200');
    label.print('DYMO LabelWriter 450 Twin Turbo');
  }

  async downloadpdf(data: any) {
    const dataget = await this.api.getpdfbase64(data);
    //console.log( dataget)
    var blob = this.b64toBlob(dataget.pdfbase64, 'application/pdf');
    let a = document.createElement('a');
    document.body.appendChild(a);
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = String(dataget.namefile + '.pdf');
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  newoinventory() {
    this.router.navigate(['inventorynew']);
  }

  inicio() {
    this.router.navigate(['dashboard']);
  }
  blockbusqueda=false
  onKeyDownEvent(event: any) {
    this.datapage.findlike = this.searchForm.value.valuesearch || '';
    
    if (event.key === 'Enter') {
    if (event.target.value.length > 2) {
      this.blockbusqueda =true
       
      setTimeout(() => {
        this.blockbusqueda=false
      }, 1000);
      this.datapage.pagination = 1;
      this.loading = true
      this.listItems(this.datapage);
    }
    }
    if (event.target.value.length == 0) {
      this.datapage.pagination = 1;
      this.loading = true
      this.listItems(this.datapage);
    } 
  }

  async changeLeagueOwner() {
    this.datapage.allclients =
      this.stateproductform.value.stateproduct_inventoryflow;
    this.datapage.pagination = 1;
    this.loading = true
    await this.listItems(this.datapage);
  }

  renderPage(event: number) { 
    this.datapage.pagination = event;
    this.loading = true
    this.listItems(this.datapage);
  }

  updateSortingperpage() {
    this.datapage.numperpage = this.numperpagesForm.value.valueperpage || '15';
    this.datapage.pagination = 1;
    this.loading = true
    this.listItems(this.datapage);
  }

  upc = '';
  nuevoForm: FormGroup = new FormGroup({
    _id: new FormControl(''),
    cod_upc: new FormControl(''),
    name_items: new FormControl(''),
    stock: new FormControl(''),
    id_brand: new FormControl(''),
    id_model: new FormControl(''),
    id_type: new FormControl(''),
    id_color: new FormControl(''),
    id_quality: new FormControl(''),
    id_stateproduct_inventoryflow: new FormControl(''),
    observations: new FormControl(''),
    id_stateinventoryflow: new FormControl(''),
   // id_comesfrom: new FormControl(''),
    get_print: new FormControl(''),
  });

  salidaForm: FormGroup = new FormGroup({
    id_item: new FormControl(''),
    codigo_movimiento: new FormControl(''),
    tipo_salida: new FormControl(null),
    numero_orden: new FormControl(''),
    cantidad: new FormControl(''),
    entrega_a: new FormControl(null),
    observaciones: new FormControl(''),
    fecha: new FormControl(new Date()),
  });

  async onSubmitclose() {
    this.submitted = true;
    this.myedit=false
    if (this.nuevoForm.invalid) {
      //  console.log(JSON.stringify(this.nuevoForm.value, null, 2));
      return;
    } else {
      const data = await this.api.dataedititem(this.nuevoForm.value);
      
      if (data == 'OK') { 
        this.listItems(this.datapage);
        this.myedit=true
        //  this.router.navigate(['inventory']);
      } else if (data.id) {
        const dataget = await this.api.getpdfbase64(data.id);
        printJS({
          printable: dataget.pdfbase64,
          type: 'pdf',
          base64: true,
          showModal: true,
        });
        //  this.router.navigate(['inventory']);
      }
    }
  }

 
  brands: ListbrandI[] = [];
  models: ListmodelI[] = [];
  colors: ListcolorI[] = [];
  types: ListtypeI[] = [];
  qualitys: ListqualityI[] = []; 
  //comesfroms: ListscomesfromI[] = [];
  stateinventoryflows: ListsstateinventoryI[] = [];
  tipo: any;
  //procedencia: any;
  color: any;
  calidad: any;
  estado: any;
  async datainit() {
    //  this.validationssalidaform()
    const data: any = await this.api.findoneitem(this.find);
 // console.log(data)
  //   await this.changeLeagueOwner1(data.items.model.id_brands);
  //   this.color = await this.colors.find((_id) => _id > data.id_color)
  //     ?.color_name;
    this.tipo = await this.types.find((_id) => _id > data.id_type)
      ?.type_inventoryflow;
  //   // this.procedencia = await this.comesfroms.find(
  //   //   (_id) => _id > data.id_comesfrom
  //   // )?.comesfrom;
  //   this.calidad = await this.qualitys.find((_id) => _id > data.id_color)
  //     ?.quality_inventoryflow;
  //   this.estado = await this.stateproducts.find(
  //     (_id) => _id > data.id_stateproduct_inventoryflow
  //   )?.stateproduct_inventoryflow;
   // console.log(data)
  //  this.upc = data.sku;
    this.nuevoForm.setValue({
      _id: data._id,
      cod_upc: data.upc,
      name_items: data.items.inventoryfownameitem.name_nameitems,
      stock: data.stockinventoryflow.stock,
      id_brand: data.items.model.brand.name_brands,
      id_model: data.items.model.business_model,
      id_type: data.typeinventoryflow._id,
      id_color: data.items.colors.color_name,
      id_quality: data.items.quality.quality_inventoryflow,
      id_stateproduct_inventoryflow: data.items.stateproductinventoryflow.stateproduct_inventoryflow,
      observations: data.observations,
      id_stateinventoryflow: data.id_state, 
      get_print: true,
    });
  }

  datareset() {
    this.nuevoForm.setValue({
      _id: '',
      cod_upc: '',
      name_items: '',
      stock: '',
      id_brand: null,
      id_model: null,
      id_type: null,
      id_color: null,
      id_quality: null,
      id_stateproduct_inventoryflow: null,
      observations: null,
      id_stateinventoryflow: null,
    //  id_comesfrom: null,
      get_print: null,
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.nuevoForm.controls;
  }
  get f1(): { [key: string]: AbstractControl } {
    return this.salidaForm.controls;
  }
  // async changeLeagueOwner1(event: any) {
  //   this.nuevoForm.controls['id_model'].setValue(null);
  //   this.models = await this.api.listmodels(event);
  // }

  salida = true;
  editar = false;
  history=false;
  incomeH=false;
  incomeRH=false;
  async salidas() {
    this.submittedoutmovement = false;
    this.editar = false;
    this.salida = true;
    this.history=false;
    this.incomeH=false;
    this.incomeRH=false;
    this.validationssalidaform();
    await this.listdataout();
    if (this.focus) {
      await this.renderer.selectRootElement('#myInput').focus();
    }
  }
  find = '';
  nameitem = '';
  focus = false;
  showModalBox: boolean = false;
  maxvalue: String = '';
  minvalue: String = '1';
  async datafind(id: any, name: any, code: any, value: any) {
    this.showModalBox = true;
    this.save = '';
    this.printt = '';
    this.focus = false;
    this.active = 1;
    this.find = id;
    this.nameitem = name + ' (' + code + ')';
    this.maxvalue = value;
    await this.salidas();
    await this.delay(400);
    await this.renderer.selectRootElement('#myInput').focus();
    this.focus = true;
  }

  editars() {
    this.salida = false;
    this.editar = true;
    this.history=false;
    this.incomeH=false;
    this.incomeRH=false;
    this.listdata();
  }
 movementshisto: Listmovementsitem[]=[]
 incomeshistory:Listincomeshistory[]=[]
 async histori() {
    this.history=true;
    this.salida = false;
    this.editar = false;
    this.incomeH=false;
    this.incomeRH=false;
    const data= await this.api.listhistoryitems(this.find)
    this.movementshisto=data
   // console.log(data)
  //  this.listdata();
  }


  async incomeh() {
    this.incomeH=true;
    this.incomeRH=false;
    this.history=false;
    this.salida = false;
    this.editar = false;
    const data= await this.api.listincomeshistory(this.find)
    this.incomeshistory=data
  //console.log(data)
  //this.listdata();
  }
  async incomehr() {
    this.incomeH=false;
    this.incomeRH=true;
    this.history=false;
    this.salida = false;
    this.editar = false;
    const data= await this.api.listincomeshistory(this.find)
    this.incomeshistory=data
  //console.log(data)
  //this.listdata();
  }
pvimpuesto(punit:any,ptax:any){
 return (((parseFloat(ptax)/100)+1) *parseFloat(punit))
}
pvitotal(punit:any,ptax:any,cant:any){
  return ((((parseFloat(ptax)/100)+1) *parseFloat(punit))*parseFloat(cant))
 }

  async listdata() {
    const data = await this.api.datanewitem('invfl');
    
    this.brands = data.brand;
    this.colors = data.color;
    this.types = data.type;
    this.qualitys = data.quality;
    this.stateproducts = data.stateproduct; 
    this.stateinventoryflows = data.stateinventoryflow;
    //this.comesfroms = data.comesfrom;
    await this.datainit();
  }

  async editorder() {
    this.submitted = true;
    if (this.nuevoForm.invalid) {
      //  console.log(JSON.stringify(this.nuevoForm.value, null, 2));
      return;
    } else {
      const data = await this.api.savenewitem(this.nuevoForm.value);
      if (data == 'OK') { 
        this.router.navigate(['inventory']);
      } else if (data.id) { 
        const dataget = await this.api.getpdfbase64(data.id);
        this.openPDFInNewTab(dataget.pdfbase64)
        // printJS({
        //   printable: dataget.pdfbase64,
        //   type: 'pdf',
        //   base64: true,
        //   showModal: true,
        // });
        this.router.navigate(['inventory']);
      }
    }
  }
  save = '';
  printt = '';

  async imputremplace(value: any) {
    this.save = this.save.replace(/null| /gi, '') + value.data;
    if (this.save.length == 36) {
      this.printt = this.save;
      this.salidaForm.controls['codigo_movimiento'].setValue(
        this.printt.replaceAll("'", '-')
      );
      this.save = '';
      this.renderer.selectRootElement('#myInput2').focus();
    } else {
      this.salidaForm.controls['codigo_movimiento'].setValue('');
    }

    await this.delay(200);
    if (this.save.length != 36) {
      this.save = '';
    }
  }
  technician:TechnicianeMoveI []=[]// TechnicianeMoveI[] = [];
  outs: MovementnameI[] = [];
  codeauto = false;
  async changeLeagueOwnertype(e: any) {
    
   const as= await this.api.liststaffmovementtype(e)
   //console.log(as)
   this.technician=as
    const found = this.outs.find((element:any) => element._id==e);
    if(found?.name_movement=='REPARACION DAÑO'||found?.name_movement=='REPARACION' ){
      this.codeauto = false

    }else{
      this.salidaForm.controls['numero_orden'].setValue('');
      this.codeauto = true
    }
  }

  async listdataout() {
    const data = await this.api.movementoutdata();
    this.technician = data.item;
    this.outs = data.outs;
    // console.log(data);

    const currentDateAndTime = this.datePipe.transform(
      new Date(),
      "yyyy-MM-dd'T'HH:mm:ss"
    );
    const uuid = uuidv4();
    //console.log(uuid)
    // console.log(currentDateAndTime)
    this.salidaForm.setValue({
      id_item: this.find,
      codigo_movimiento: uuid,
      tipo_salida: data.outs[3]._id,
      numero_orden: '',
      cantidad: this.functionvalue(this.maxvalue),
      entrega_a: null,
      observaciones: '',
      fecha: currentDateAndTime,
    });
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

  async codesqrprint() {
    this.simpleAlert();
    const data = await this.api.movementgetcodes();
    if (data) {
      this.openPDFInNewTab(data)
      // printJS({
      //   printable: data,
      //   type: 'pdf',
      //   base64: true,
      //   showModal: true,
      // });
      Swal.close();
    }
  }

  submittedoutmovement = false;
 
  async saveoutmovement() {
   // console.log(this.salidaForm.value.numero_orden)

     //   ;
    this.submittedoutmovement = true;
    if (this.salidaForm.invalid) {
      // console.log(JSON.stringify(this.salidaForm.value, null, 2));
      return;
    } else { 
      const data = await this.api.movementoutsave(this.salidaForm.value);
      if (data == 'OK') { 
        this.listItems(this.datapage);
        this.closebutton.nativeElement.click();
        this.find = '';
        this.submittedoutmovement = false;
      } 
    }
  }
  datacolor1(data: any) {
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
    
  currentDate = new Date();
  validationssalidaform() {

    this.salidaForm = this.formBuilder.group({
      id_item: ['', Validators.required],
      codigo_movimiento: [
         '' ,
        [
          Validators.required,
          Validators.minLength(36),
          Validators.maxLength(36),
        ],
      ],
      tipo_salida: ['', Validators.required],
      numero_orden: [''],
      cantidad: [1, Validators.required],
      entrega_a: ['', Validators.required],
      observaciones: [''],
      fecha: [
        formatDate(this.currentDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US'),
        Validators.required,
      ],
    });
  }

  public b64toBlob(b64Data: any, contentType: any) {
    contentType = contentType || '';
    let sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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


  datosTabla: any[] = [
    { columna1: 'Dato1', columna2: 'Dato2', columna3: 'Dato3', columna4: 'Dato4', columna5: 'Dato5', columna6: 'Dato6', columna7: 'Dato7' },
    // Agrega más datos según sea necesario
  ];

  modalVisible4:boolean=false
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
}
