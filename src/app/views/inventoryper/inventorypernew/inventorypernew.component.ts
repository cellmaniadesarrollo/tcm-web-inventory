import { ElementRef, Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  ListnameI,
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
} from 'src/app/models/item.inteface';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';  

@Component({
  selector: 'app-inventorypernew',
  templateUrl: './inventorypernew.component.html',
  styleUrls: ['./inventorypernew.component.css'],
})
export class InventorypernewComponent {
  @ViewChild('ngselects') ngselect: any;
  @ViewChild('inputElement') inputElement: any;
  @ViewChild('inputElementmodelo') inputElementmodelo: any;
  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,  
    
  ) {  
  }
  brands: ListbrandI[] = [];
  nameite: ListnameI[] = [];
  models: ListmodelI[] = [];
  colors: ListcolorI[] = [];
  types: ListtypeI[] = [];
  qualitys: ListqualityI[] = [];
  stateproducts: ListstateproductI[] = [];
  weights: ListsweightI[] = [];
  volumes: ListsvolumeI[] = [];

  // comesfroms: ListscomesfromI[] = [];
  stateinventoryflows: ListsstateinventoryI[] = [];
  codeauto = true;
  submitted = false;
  nuevoForm: FormGroup = new FormGroup({
    cod_upc: new FormControl(''),
    name_items: new FormControl(null),
    stock: new FormControl(''),
    id_brand: new FormControl(''),
    id_model: new FormControl(''),
    id_type: new FormControl(''),
    id_color: new FormControl(''),
    id_quality: new FormControl(''),
    id_stateproduct_inventoryflow: new FormControl(''),
    observations: new FormControl(''),
    get_print: new FormControl(true),
    price: new FormControl(''),
  }); 
  ngOnInit(): void {

   
    this.getsdata();
    this.validations();
     //this.sendMessage()
  }

   



  validations() {
    this.nuevoForm = this.formBuilder.group({
      cod_upc: [false, Validators.required],
      name_items: ['', Validators.required],
      stock: [0, Validators.required],
      id_brand: [''],
      id_model: ['', Validators.required],
      id_type: ['', Validators.required],
      id_color: ['', Validators.required],
      id_quality: ['', Validators.required],
      id_stateproduct_inventoryflow: ['', Validators.required],
      observations: [''],
      get_print: [true, Validators.required],
      price: [0 ],
    });
  }
  async getsdata() {
    const data = await this.api.getnewdatainvantoryrep('invper');
    this.nameite = data.names;
    this.brands = data.brand;
    this.types = data.type;
    this.colors = data.color;
    this.qualitys = data.quality;
    this.stateproducts = data.stateproduct;
  }
  printbutton(e: any) {
    if (e.target.checked) {
      this.nuevoForm.controls['get_print'].setValue(true);
    } else {
      this.nuevoForm.controls['get_print'].setValue(false);
    }
  }
  onCheckboxChange(e: any) {
    if (e.target.checked) {
      this.nuevoForm.controls['cod_upc'].setValue(false);
      this.codeauto = true;
    } else {
      this.nuevoForm.controls['cod_upc'].setValue('');
      this.codeauto = false;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.nuevoForm.controls;
  }

  async changeLeagueOwner(event: any) {
    this.nuevoForm.controls['id_model'].setValue(null);
    //this.models = await this.api.listmodels(event);
    // console.log(this.models)
  }

  terminoDeBusqueda: String = '';
  terminoDeBusqueda1 = '';
  mostrarSugerencias1 = false;
  mostrarSugerencias2 = false;
  mostrarSugerencias3 = false;
  mostrarSugerencias4 = false;
  mostrarSugerencias5 = false;
  mostrarSugerencias6 = false;
  mostrarSugerencias7 = false;
  mostrarSugerencias = false;
  blockbusquedaname = false;
  loadername = false;
  loaderbrand = false;
  loadermodel = false; 
  searchTerm: string = '';
  searchmodels: string = '';
  searchtype: string = '';
  searchcolor: string = '';
  searchquality: string = '';
  searchstateproduct_inventoryflow: string = '';
  filtrarSugerencias() {
    this.mostrarSugerencias = this.terminoDeBusqueda.length > 0;
  }
  async makechoice(event: any) {
    if (event.key === 'Enter' || event === 'Enter') {
      if (this.terminoDeBusqueda.length > 2) {
        this.mostrarSugerencias = true;
        this.blockbusquedaname = true;
        this.loadername = true;
        setTimeout(() => {
          this.blockbusquedaname = false;
          this.loadername = false;
        }, 1000);
        this.nameite = await this.api.findnameinvantoryrep({
          like: this.terminoDeBusqueda,
        });
        setTimeout(() => {
          this.inputElement.nativeElement.focus();
        }, 100);
      }
    }
  }

  onInputFocus(data: string) {
    switch (data) {
      case 'name_items':
        this.mostrarSugerencias = true;
        break;
      case 'id_brand':
        this.mostrarSugerencias2 = true;
        break;
      case 'id_model':
        this.mostrarSugerencias3 = true;
        break;
      case 'id_type':
        this.mostrarSugerencias4 = true;
        break;
      case 'id_color':
        this.mostrarSugerencias5 = true;
        break;
      case 'id_quality':
        this.mostrarSugerencias6 = true;
        break;
      case 'id_stateproduct_inventoryflow':
        this.mostrarSugerencias7 = true;
        break;
      default:
        break;
    }
  }

  onInputBlur(data: string) {
    if (
      this.mostrarSugerencias ||
      this.mostrarSugerencias2 ||
      this.mostrarSugerencias3 ||
      this.mostrarSugerencias4 ||
      this.mostrarSugerencias5 ||
      this.mostrarSugerencias6 ||
      this.mostrarSugerencias7
    ) {
      setTimeout(() => {
        switch (data) {
          case 'name_items':
            this.mostrarSugerencias = false;
            break;
          case 'id_brand':
            this.mostrarSugerencias2 = false;
            break;
          case 'id_model':
            this.mostrarSugerencias3 = false;
            break;
          case 'id_type':
            this.mostrarSugerencias4 = false;
            break;
          case 'id_color':
            this.mostrarSugerencias5 = false;
            break;
          case 'id_quality':
            this.mostrarSugerencias6 = false;
            break;
          case 'id_stateproduct_inventoryflow':
            this.mostrarSugerencias7 = false;
            break;
          default:
            break;
        }

        console.log('Input fuera de foco');
      }, 200);
    }
    // Realizar acciones cuando el input pierde el foco
  }

  seleccionarSugerencia(sugerencia: string, id: string, input: string) {
    this.cambios(sugerencia, input, id);
  }
  onInputChange(dat: any) {
    this.cambios(null, dat, '');
  }

  cambios(dat: any, cambio: any, id: string) {
    if (this.nuevoForm.controls[cambio].getRawValue() != null && dat == null) {
      this.cambios1('', cambio);
      this.nuevoForm.controls[cambio].setValue(null);
    } else if (id != '') {
      this.cambios1(dat, cambio);
      this.nuevoForm.controls[cambio].setValue(id);
    }
  }
  cambios1(dat: any, cambio: any) {
    switch (cambio) {
      case 'name_items':
        this.terminoDeBusqueda = dat;
        break;
      case 'id_brand':
        this.searchTerm = dat;
        break;
      case 'id_model':
        this.searchmodels = dat;
        break;
      case 'id_type':
        this.searchtype = dat;
        break;
      case 'id_color':
        this.searchcolor = dat;
        break;
      case 'id_quality':
        this.searchquality = dat;
        break;
      case 'id_stateproduct_inventoryflow':
        this.searchstateproduct_inventoryflow = dat;
        break;
      default:
        break;
    }
  }
  async getmodels(dat: string) {
    this.loadermodel = true;
    this.models = await this.api.listmodels(dat);
    this.inputElementmodelo.nativeElement.focus();
    this.loadermodel = false;
    this.mostrarSugerencias3 = true;
  }

  modalVisible: boolean = false;
  modalVisible1: boolean = false;
  modalVisible2: boolean = false;
  modalVisible3: boolean = false;
  modalVisible4: boolean = false;
  modalVisible5: boolean = false;
  modalVisible6: boolean = false;
  openModal() {
    this.modalVisible = true;
  }

  closeModal(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible = false;
    }
    if (event.data.data.id) {
      this.nameite.unshift({
        _id: event.data.data.id,
        name_nameitems: event.data.data.name,
      });
      this.seleccionarSugerencia(
        event.data.data.name,
        event.data.data.id,
        'name_items'
      );
    }
  }
  openModalbrand() {
    console.log('brandf');
    this.modalVisible1 = true;
  }
  closeModalbrand(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible1 = false;
    }
    if (event.data.data.id) {
      this.brands.unshift({
        _id: event.data.data.id,
        name_brands: event.data.data.name,
      });
      this.seleccionarSugerencia( 
        event.data.data.name,
        event.data.data.id,
        'id_brand'
      );
    }
  }
  openModalmodel() {
    this.modalVisible2 = true;
  }
  closeModalmodel(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible2 = false;
    }
    if (event.data.data.id) {
      const marca = this.brands.find(
        (element) => element._id == event.data.data.brand
      );
      this.seleccionarSugerencia(marca?.name_brands, marca?._id, 'id_brand');
      this.getmodels(event.data.data.brand);
      this.seleccionarSugerencia(
        event.data.data.name,
        event.data.data.id,
        'id_model'
      );
    }
  }
  urltype: string = 'invper';
  nameinventory:string='invper'
  openModaltype() {
    this.modalVisible3 = true;
  }
  closeModaltype(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible3 = false;
    }
    if (event.data.data.id) {
      this.types.unshift({
        _id: event.data.data.id,
        type_inventoryflow: event.data.data.name,
      });
      this.seleccionarSugerencia(
        event.data.data.name,
        event.data.data.id,
        'id_type'
      );
    }
  }
  openModalcolor() {
    this.modalVisible4 = true;
  }

  closeModalcolor(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible4 = false;
    }
    if (event.data.data.id) {
      this.colors.unshift({
        _id: event.data.data.id,
        color_name: event.data.data.name,
      });
      this.seleccionarSugerencia(
        event.data.data.name,
        event.data.data.id,
        'id_color'
      );
    }
  }
  openModalquality() {
    this.modalVisible5 = true;
  }

  closeModalquality(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible5 = false;
    }
    if (event.data.data.id) {
      this.qualitys.unshift({
        _id: event.data.data.id,
        quality_inventoryflow: event.data.data.name,
      });
      this.seleccionarSugerencia(
        event.data.data.name,
        event.data.data.id,
        'id_quality'
      );
    }
  }
  openModalstate() {
    this.modalVisible6 = true;
  }

  closeModalstate(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible6 = false;
    }
    if (event.data.data.id) {
      this.stateproducts.unshift({
        _id: event.data.data.id,
        stateproduct_inventoryflow: event.data.data.name,
      });
      this.seleccionarSugerencia(
        event.data.data.name,
        event.data.data.id,
        'id_stateproduct_inventoryflow'
      );
    }
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (this.nuevoForm.invalid) {
      return;
    } else {
    const dat= await this.api.savenewitemper(this.nuevoForm.value);
    if (dat == 'OK') {
      this.submitted = false; 
      this.getsdata();
      this.reset()
      this.validations();
    } else if (dat.id) { 
      const params = new URLSearchParams(dat.id)
      const url =`http://192.168.10.250:5000/api/printtikets?${params.toString()}`;//`http://localhost:5000/api/printtikets?${params.toString()}`; //
      window.open(url, '_blank');
      // const dataget = await this.api.getpdfbase64(dat.id);
      // this.openPDFInNewTab(dataget.pdfbase64);
      this.getsdata();
      this.reset()
      this.validations();
      this.submitted = false;
    }

    }
  }
  async onSubmitclose(): Promise<void> {
    this.submitted = true;
    if (this.nuevoForm.invalid) {
      return;
    } else {
     await this.api.savenewitemper(this.nuevoForm.value);
     this.router.navigate(['inventoryper']);
    }
  }
  cancelar() {
    this.router.navigate(['inventoryper']);
  }
  inicio() {
    this.router.navigate(['dashboard']);
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

  reset(){
    this.searchTerm  = '';
    this.searchmodels  = '';
    this.searchtype  = '';
    this.searchcolor  = '';
    this.searchquality  = '';
    this.searchstateproduct_inventoryflow  = '';
    this.terminoDeBusqueda='';
  }
  onFocus(event: any) { 
    event.target.select();
  }
}
