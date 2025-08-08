import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
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
} from 'src/app/models/item.inteface';
import printJS from 'print-js';
import { UbicacionCompartidaService } from 'src/app/service/ubicacion-compartida/ubicacion-compartida.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-inventorysalesnew',
  templateUrl: './inventorysalesnew.component.html',
  styleUrls: ['./inventorysalesnew.component.css']
})
export class InventorysalesnewComponent {
 @ViewChild('ngselects') ngselect: any;
 private subscriptions: Subscription = new Subscription();
  constructor(
    private api: ApiService,
    private activerouter: ActivatedRoute,
    private router: Router,
    private config: NgSelectConfig,
    private formBuilder: FormBuilder,
    private ubicacionService:UbicacionCompartidaService
  ) {}
  nuevoForm: FormGroup = new FormGroup({
    cod_upc: new FormControl(''),
    name_items: new FormControl(null), 
    id_brand: new FormControl(''),
    id_model: new FormControl(''),
    id_type: new FormControl(''),
    id_color: new FormControl(''),
    id_quality: new FormControl(''),
    id_stateproduct_inventoryflow: new FormControl(''),
    observations: new FormControl(''),
    weight: new FormControl(''),
    volume: new FormControl(''),
    id_weightnomen: new FormControl(''),
    id_volumenomen: new FormControl(''),
    id_stateinventoryflow: new FormControl(''),
    // id_comesfrom: new FormControl(''),
    get_print: new FormControl(''),
    ubicacion: new FormGroup({
      latitud: new FormControl(null), // Inicializa como null
      longitud: new FormControl(null) // Inicializa como null
    })
  }); 

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
  sucursal: any;user: any;
  sucursal_name:string='DESCONOCIDA'
  ngOnInit(): void {
    this.validations(); 
    this.listdata(); 
this.subscriptions.add(
  this.ubicacionService.coordenadas$.subscribe(coords => {
    const { latitud, longitud } = coords;

    // Verificar si las coordenadas recibidas son válidas
    const esUbicacionInvalida = latitud === 0 && longitud === 0;

    // Obtener el valor actual del formulario
    const ubicacionActual = this.nuevoForm.get('ubicacion')?.value;

    // Verificar si ya hay una ubicación válida establecida
    const yaTieneUbicacion = ubicacionActual?.latitud !== null && ubicacionActual?.longitud !== null;

    if (!esUbicacionInvalida && !yaTieneUbicacion) { 
      this.nuevoForm.patchValue({
        ubicacion: coords
      });
    }
  })
);
    this.subscriptions.add(
      this.ubicacionService.nombreSucursal$.subscribe(nombre => {
        this.sucursal_name = nombre;
      })
    );
  }
  
  modalVisible: boolean = false;
  modalVisible1: boolean = false;
  modalVisible2: boolean = false;
  modalVisible3: boolean = false;
  modalVisible4: boolean = false;
  modalVisible5: boolean = false;
  modalVisible6: boolean = false;
  nameinventory:string='invsal'
  openModalname() {
    this.modalVisible = true;
  }

  closeModalname(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible = false;
    }
    if (event.data.data.id) {
      this.nameite.unshift({
        _id: event.data.data.id,
        name_nameitems: event.data.data.name,
      });
      this.nuevoForm.controls['name_items'].setValue(event.data.data.id);
    }
  }
  openModalbrand() {
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
      this.nuevoForm.controls['id_brand'].setValue(event.data.data.id);
    }
  }
  openModalmodel() {
    this.modalVisible2 = true;
  }
  async closeModalmodel(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible2 = false;
    }
    if (event.data.data.id) {
      this.models = await this.api.listmodels(event.data.data.brand);
      this.nuevoForm.controls['id_brand'].setValue(event.data.data.brand);
      this.nuevoForm.controls['id_model'].setValue(event.data.data.id);
    }
  }

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
      this.nuevoForm.controls['id_type'].setValue(event.data.data.id);
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
      this.nuevoForm.controls['id_color'].setValue(event.data.data.id);
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
      this.nuevoForm.controls['id_quality'].setValue(event.data.data.id);
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
      this.nuevoForm.controls['id_stateproduct_inventoryflow'].setValue(event.data.data.id);
    }
  }

  async changeLeagueOwner(event: any) {
    this.nuevoForm.controls['id_model'].setValue(null);
    this.models = await this.api.listmodels(event);   
  }

  async guardaritem() {
    await this.api.datanewitem('invsal');
  }

  async listdata() {
    const data = await this.api.datanewitem('invsal'); 
    this.brands = data.brand;
    this.colors = data.color;
    this.types = data.type;
    this.qualitys = data.quality;
    this.stateproducts = data.stateproduct;
    this.stateinventoryflows = data.stateinventoryflow;
    // this.comesfroms = data.comesfrom;
    this.nameite = data.names;
    this.datainit();
  }
  datainit() {
      // Obtener coordenadas actuales del observable o del form
  const ubicacionActual = this.nuevoForm.get('ubicacion')?.value;

  const coordenadasValidas = (ubicacionActual?.latitud !== null && ubicacionActual?.longitud !== null)
    ? ubicacionActual
    : { latitud: null, longitud: null };
    this.nuevoForm.setValue({
      cod_upc: false,
      name_items: null, 
      id_brand: null,
      id_model: null,
      id_type: null,
      id_color: null,
      id_quality: null,
      id_stateproduct_inventoryflow: null,
      observations: '',
      id_stateinventoryflow: this.stateinventoryflows[0]._id,
      //id_comesfrom: null,
      get_print: false,
ubicacion: coordenadasValidas
    });
  }

  // async onSubmit(form: any) {
  //   const data = 's'//await this.api.savecustomer(form);
  //   console.log(data);
  // } 
  validations() {
    this.nuevoForm = this.formBuilder.group({
      cod_upc: ['', Validators.required],
      name_items: [null, Validators.required], 
      id_brand: [''],
      id_model: ['', Validators.required],
      id_type: ['', Validators.required],
      id_color: ['', Validators.required],
      id_quality: ['', Validators.required],
      id_stateproduct_inventoryflow: ['', Validators.required],
      observations: [''],
      id_stateinventoryflow: ['', Validators.required],
      //  id_comesfrom: ['', Validators.required],
      get_print: [true, Validators.required],
      ubicacion: this.formBuilder.group({
        latitud: [null, [Validators.required, Validators.min(-90), Validators.max(90)]], // Validaciones opcionales
        longitud: [null, [Validators.required, Validators.min(-180), Validators.max(180)]]
      })
    });
  }

 
 
 
 

  codeauto = true;
  submitted = false;
  submittedmarca = false;
  submittedname = false;
  submittedmodel = false;
  submittedtype = false;
  submittedcolor = false;
  submittedquality = false;
  submittedstateproduct = false;
  //submittedcomesfrom = false;
  onSubmit(form: any): void {
    this.submitted = true; 
    if (this.nuevoForm.invalid) {
      //this.postForm(form);
      // console.log(JSON.stringify(this.nuevoForm.value, null, 2));
      return;
    } else {
      this.postForm(form);
    }
    // this.postForm(form);
    // console.log(JSON.stringify(form, null, 2));
  }

  async postForm(form: any) {
    
    const get = await this.api.savenewitemsales(form);

    if (get == 'OK') {
      this.datainit();
      this.submitted = false;
    } else if (get.id) {
      const params = new URLSearchParams(get.id)
      const url =`http://192.168.10.250:5000/api/printtikets?${params.toString()}`;//`http://localhost:5000/api/printtikets?${params.toString()}`; //
      window.open(url, '_blank'); 
      this.datainit();
      this.submitted = false;
    }
    //console.log(get);
  }

  async onSubmitclose() {
    this.submitted = true;
    console.log(this.nuevoForm.value)
    if (this.nuevoForm.invalid) { 
      return;
    } else {
      const data = await this.api.savenewitemsales(this.nuevoForm.value);
      if (data == 'OK') {
        this.router.navigate(['inventorysales']);
      } else if (data.id) {
        const params = new URLSearchParams(data.id)
        const url =`http://192.168.10.250:5000/api/printtikets?${params.toString()}`;//`http://localhost:5000/api/printtikets?${params.toString()}`; //
        window.open(url, '_blank'); 
        this.router.navigate(['inventorysales']);
      }
    }
  }
  cancelar() {
    this.router.navigate(['inventorysales']);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.nuevoForm.controls;
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
  print(pdf: any) {
    printJS({ printable: pdf, type: 'pdf', showModal: true });
  }
  async makechoice() {
    if (this.nuevoForm.controls['id_brand'].getRawValue() == null) {
      return;
    }

    if (this.ngselect.searchTerm != null) {
      if (this.ngselect.searchTerm.length > 1) {
        let data = {
          id: this.nuevoForm.controls['id_brand'].getRawValue(),
          find: this.ngselect.searchTerm,
        };
        this.models = await this.api.listmodelsfind(data);
        //console.log(this.items);
      } else if (this.ngselect.searchTerm.length <= 1) {
        this.models = await this.api.listmodels(
          this.nuevoForm.controls['id_brand'].getRawValue()
        );
      }
    } else {
      this.models = await this.api.listmodels(
        this.nuevoForm.controls['id_brand'].getRawValue()
      );
    }
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
}
