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

@Component({
  selector: 'app-inventorynew',
  templateUrl: './inventorynew.component.html',
  styleUrls: ['./inventorynew.component.css'],
})
export class InventorynewComponent {
  @ViewChild('ngselects') ngselect: any;
  constructor(
    private api: ApiService,
    private activerouter: ActivatedRoute,
    private router: Router,
    private config: NgSelectConfig,
    private formBuilder: FormBuilder
  ) {}
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
    weight: new FormControl(''),
    volume: new FormControl(''),
    id_weightnomen: new FormControl(''),
    id_volumenomen: new FormControl(''),
    id_stateinventoryflow: new FormControl(''),
    // id_comesfrom: new FormControl(''),
    get_print: new FormControl(''),
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
  ngOnInit(): void {
    this.validations(); 
    this.listdata();
  }
  
  modalVisible: boolean = false;
  modalVisible1: boolean = false;
  modalVisible2: boolean = false;
  modalVisible3: boolean = false;
  modalVisible4: boolean = false;
  modalVisible5: boolean = false;
  modalVisible6: boolean = false;
  nameinventory:string='invfl'
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
    await this.api.datanewitem('invfl');
  }

  async listdata() {
    const data = await this.api.datanewitem('invfl'); 
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
    this.nuevoForm.setValue({
      cod_upc: false,
      name_items: null,
      stock: null,
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
      stock: ['', Validators.required],
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
    const get = await this.api.savenewitem(form);

    if (get == 'OK') {
      this.datainit();
      this.submitted = false;
    } else if (get.id) {
      const params = new URLSearchParams(get.id)
      const url =`http://192.168.10.250:5000/api/printtikets?${params.toString()}`;//`http://localhost:5000/api/printtikets?${params.toString()}`; //
      window.open(url, '_blank');
      // const dataget = await this.api.getpdfbase64(get.id);
      // this.openPDFInNewTab(dataget.pdfbase64);
      //console.log(dataget)
      // printJS({
      //   printable: dataget.pdfbase64,
      //   type: 'pdf',
      //   base64: true,
      //   showModal: true,
      // });
      this.datainit();
      this.submitted = false;
    }
    //console.log(get);
  }

  async onSubmitclose() {
    this.submitted = true;
    if (this.nuevoForm.invalid) {
      console.log(JSON.stringify(this.nuevoForm.value, null, 2));
      return;
    } else {
      const data = await this.api.savenewitem(this.nuevoForm.value);
      if (data == 'OK') {
        this.router.navigate(['inventory']);
      } else if (data.id) {
        const params = new URLSearchParams(data.id)
        const url =`http://192.168.10.250:5000/api/printtikets?${params.toString()}`;//`http://localhost:5000/api/printtikets?${params.toString()}`; //
        window.open(url, '_blank');
        // const dataget = await this.api.getpdfbase64(data.id);
        // this.openPDFInNewTab(dataget.pdfbase64);
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
  cancelar() {
    this.router.navigate(['inventory']);
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
