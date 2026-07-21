// nuevo-pedido.component.ts (VERSIÓN COMPLETA CORREGIDA)
import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CrearPedido } from 'src/app/service/pedido/CrearPedido.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<any>();
  @Output() productoCreado = new EventEmitter<any>();

  constructor(
    private apiPedido: CrearPedido,
    private activerouter: ActivatedRoute,
    private router: Router,
    private config: NgSelectConfig,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModal: any
  ) { }

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
  stateinventoryflows: ListsstateinventoryI[] = [];

  nameiteFiltrados: ListnameI[] = [];
  brandsFiltradas: ListbrandI[] = [];
  modelsFiltrados: ListmodelI[] = [];
  typesFiltrados: ListtypeI[] = [];
  colorsFiltrados: ListcolorI[] = [];
  qualitysFiltradas: ListqualityI[] = [];
  stateproductsFiltrados: ListstateproductI[] = [];

  modalVisible: boolean = false;
  modalVisible1: boolean = false;
  modalVisible2: boolean = false;
  modalVisible3: boolean = false;
  modalVisible4: boolean = false;
  modalVisible5: boolean = false;
  modalVisible6: boolean = false;
  nameinventory: string = 'invfl';

  codeauto = true;
  submitted = false;
  isButtonDisabled = false;
  private safetyTimeoutId: any = null;

  ngOnInit(): void {
    this.validations();
    this.listdata();
  }

  datainit() {
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
      get_print: false,
    });
  }

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
      get_print: [true, Validators.required],
    });
  }

  // ============ MANEJO DE CIERRES ============

  cerrarModal(): void {
    this.closeModalEvent.emit({ reload: false });
    this.dialogRef.close(false);
  }

  cerrarModalYRecargar(): void {
    this.closeModalEvent.emit({ reload: true });
    this.dialogRef.close(true);
  }

  cancelar() {
    this.cerrarModal();
  }

  // ============ LOGICA DE GUARDADO - CORREGIDA ============

  /**
   * ✅ Método onSubmit - Llama a postForm (para compatibilidad con el HTML)
   */
  onSubmit(form: any): void {
    this.submitted = true;

    if (this.nuevoForm.invalid) {
      return;
    }

    this.isButtonDisabled = true;
    this.startButtonSafetyTimer();
    this.postForm(form);
  }

  async postForm(form: any) {
    try {
      const get = await this.apiPedido.savenewitemsales(form);

      if (get == 'OK' || get.id) {
        const productId = form.name_items;
        const productoCompleto = this.nameite.find(i => i._id === productId);
        
        const brand = this.brands.find(b => b._id === form.id_brand);
        const model = this.models.find(m => m._id === form.id_model);
        const type = this.types.find(t => t._id === form.id_type);
        const color = this.colors.find(c => c._id === form.id_color);
        const quality = this.qualitys.find(q => q._id === form.id_quality);
        const state = this.stateproducts.find(s => s._id === form.id_stateproduct_inventoryflow);
        
        // ✅ OBTENER EL UPC CORRECTAMENTE
        const upcValue = this.codeauto ? (get.upc || '') : (form.cod_upc || '');
        
        const productData = {
          id: productId,
          name: productoCompleto?.name_nameitems || '',
          sku: get.sku || '',
          producto: {
            _id: productId,
            name_nameitems: productoCompleto?.name_nameitems || '',
            upc: upcValue,
            brand: brand ? { _id: brand._id, name_brands: brand.name_brands } : null,
            modelitem: model ? { _id: model._id, business_model: model.business_model } : null,
            type: type ? { _id: type._id, type_inventoryflow: type.type_inventoryflow } : null,
            colors1: color ? { _id: color._id, color_name: color.color_name } : null,
            quality: quality ? { _id: quality._id, quality_inventoryflow: quality.quality_inventoryflow } : null,
            stateproduc: state ? { _id: state._id, stateproduct_inventoryflow: state.stateproduct_inventoryflow } : null,
            price: get.price || 0,
            hasTax: get.hasTax !== undefined ? get.hasTax : true,
            last_unit_price_income: get.last_unit_price_income || 0,
            observations: form.observations || '',
            ...get
          }
        };
        
        console.log('📦 Producto emitido con todos los datos:', productData);
        
        this.productoCreado.emit(productData);
        
        this.datainit();
        this.submitted = false;
        this.setDefaultValues();
        
        if (get.id) {
          const params = new URLSearchParams(get.id);
          const url = `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;
          window.open(url, '_blank');
        }
        
        this.cerrarModalYRecargar();
      }
    } catch (error) {
      console.error('Error al guardar el item:', error);
    } finally {
      this.isButtonDisabled = false;
      this.clearButtonSafetyTimer();
    }
  }

  async onSubmitclose() {
    this.submitted = true;
    if (this.nuevoForm.invalid) {
      return;
    }

    this.isButtonDisabled = true;
    try {
      const data = await this.apiPedido.savenewitemsales(this.nuevoForm.value);
      if (data == 'OK' || data.id) {
        const productId = this.nuevoForm.value.name_items;
        const productoCompleto = this.nameite.find(i => i._id === productId);
        
        const brand = this.brands.find(b => b._id === this.nuevoForm.value.id_brand);
        const model = this.models.find(m => m._id === this.nuevoForm.value.id_model);
        const type = this.types.find(t => t._id === this.nuevoForm.value.id_type);
        const color = this.colors.find(c => c._id === this.nuevoForm.value.id_color);
        const quality = this.qualitys.find(q => q._id === this.nuevoForm.value.id_quality);
        const state = this.stateproducts.find(s => s._id === this.nuevoForm.value.id_stateproduct_inventoryflow);
        
        // ✅ OBTENER EL UPC CORRECTAMENTE
        const upcValue = this.codeauto ? (data.upc || '') : (this.nuevoForm.value.cod_upc || '');
        
        const productData = {
          id: productId,
          name: productoCompleto?.name_nameitems || '',
          sku: data.sku || '',
          producto: {
            _id: productId,
            name_nameitems: productoCompleto?.name_nameitems || '',
            upc: upcValue,
            brand: brand ? { _id: brand._id, name_brands: brand.name_brands } : null,
            modelitem: model ? { _id: model._id, business_model: model.business_model } : null,
            type: type ? { _id: type._id, type_inventoryflow: type.type_inventoryflow } : null,
            colors1: color ? { _id: color._id, color_name: color.color_name } : null,
            quality: quality ? { _id: quality._id, quality_inventoryflow: quality.quality_inventoryflow } : null,
            stateproduc: state ? { _id: state._id, stateproduct_inventoryflow: state.stateproduct_inventoryflow } : null,
            price: data.price || 0,
            hasTax: data.hasTax !== undefined ? data.hasTax : true,
            last_unit_price_income: data.last_unit_price_income || 0,
            observations: this.nuevoForm.value.observations || '',
            ...data
          }
        };
        
        console.log('📦 Producto emitido con todos los datos:', productData);
        this.productoCreado.emit(productData);
        
        if (data.id) {
          const params = new URLSearchParams(data.id);
          const url = `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;
          window.open(url, '_blank');
        }
        this.cerrarModalYRecargar();
      }
    } catch (error) {
      console.error('Error al guardar y cerrar:', error);
    } finally {
      this.isButtonDisabled = false;
    }
  }

  // ============ SERVICIOS Y MODALES HIJOS ============

  async listdata() {
    const data = await this.apiPedido.datanewitem('invfl');
    this.brands = data.brand;
    this.colors = data.color;
    this.types = data.type;
    this.qualitys = data.quality;
    this.stateproducts = data.stateproduct;
    this.stateinventoryflows = data.stateinventoryflow;
    this.nameite = data.names;

    this.nameiteFiltrados = [...this.nameite];
    this.brandsFiltradas = [...this.brands];
    this.modelsFiltrados = [...this.models];
    this.typesFiltrados = [...this.types];
    this.colorsFiltrados = [...this.colors];
    this.qualitysFiltradas = [...this.qualitys];
    this.stateproductsFiltrados = [...this.stateproducts];

    this.datainit();
    this.setDefaultValues();
  }

  setDefaultValues() {
    if (this.nameite && this.nameite.length > 0) {
      this.nuevoForm.controls['name_items'].setValue(this.nameite[0]._id);
    }
    if (this.brands && this.brands.length > 0) {
      this.nuevoForm.controls['id_brand'].setValue(this.brands[0]._id);
    }
    if (this.models && this.models.length > 0) {
      this.nuevoForm.controls['id_model'].setValue(this.models[0]._id);
    }
    if (this.types && this.types.length > 0) {
      this.nuevoForm.controls['id_type'].setValue(this.types[0]._id);
    }
    if (this.colors && this.colors.length > 0) {
      this.nuevoForm.controls['id_color'].setValue(this.colors[0]._id);
    }
    if (this.qualitys && this.qualitys.length > 0) {
      this.nuevoForm.controls['id_quality'].setValue(this.qualitys[0]._id);
    }
    if (this.stateproducts && this.stateproducts.length > 0) {
      this.nuevoForm.controls['id_stateproduct_inventoryflow'].setValue(this.stateproducts[0]._id);
    }
    this.codeauto = true;
  }

  async changeLeagueOwner(brandId: any) {
    this.nuevoForm.controls['id_model'].setValue(null);
    this.models = await this.apiPedido.listmodels(brandId);
    this.modelsFiltrados = [...this.models];
    if (this.models && this.models.length > 0) {
      this.nuevoForm.controls['id_model'].setValue(this.models[0]._id);
    }
  }

  // ============ FUNCIONES DE FILTRADO ============

  filtrarProductos(valor: string) {
    if (!valor) { this.nameiteFiltrados = [...this.nameite]; return; }
    const b = valor.toLowerCase();
    this.nameiteFiltrados = this.nameite.filter(i => i.name_nameitems?.toLowerCase().includes(b));
  }

  filtrarMarcas(valor: string) {
    if (!valor) { this.brandsFiltradas = [...this.brands]; return; }
    const b = valor.toLowerCase();
    this.brandsFiltradas = this.brands.filter(i => i.name_brands?.toLowerCase().includes(b));
  }

  filtrarModelos(valor: string) {
    if (!valor) { this.modelsFiltrados = [...this.models]; return; }
    const b = valor.toLowerCase();
    this.modelsFiltrados = this.models.filter(i => 
      i.business_model?.toLowerCase().includes(b) || i._id?.toLowerCase().includes(b)
    );
  }

  filtrarTipos(valor: string) {
    if (!valor) { this.typesFiltrados = [...this.types]; return; }
    const b = valor.toLowerCase();
    this.typesFiltrados = this.types.filter(i => i.type_inventoryflow?.toLowerCase().includes(b));
  }

  filtrarColores(valor: string) {
    if (!valor) { this.colorsFiltrados = [...this.colors]; return; }
    const b = valor.toLowerCase();
    this.colorsFiltrados = this.colors.filter(i => i.color_name?.toLowerCase().includes(b));
  }

  filtrarCalidades(valor: string) {
    if (!valor) { this.qualitysFiltradas = [...this.qualitys]; return; }
    const b = valor.toLowerCase();
    this.qualitysFiltradas = this.qualitys.filter(i => i.quality_inventoryflow?.toLowerCase().includes(b));
  }

  filtrarEstados(valor: string) {
    if (!valor) { this.stateproductsFiltrados = [...this.stateproducts]; return; }
    const b = valor.toLowerCase();
    this.stateproductsFiltrados = this.stateproducts.filter(i => i.stateproduct_inventoryflow?.toLowerCase().includes(b));
  }

  // ============ MODALES HIJOS ============

  openModalname() { this.modalVisible = true; }
  closeModalname(event: { data: any }) {
    if (event.data.close) this.modalVisible = false;
    if (event.data.data.id) {
      const nuevoItem = { _id: event.data.data.id, name_nameitems: event.data.data.name };
      this.nameite.unshift(nuevoItem);
      this.nameiteFiltrados = [...this.nameite];
      this.nuevoForm.controls['name_items'].setValue(event.data.data.id);
    }
  }

  openModalbrand() { this.modalVisible1 = true; }
  closeModalbrand(event: { data: any }) {
    if (event.data.close) this.modalVisible1 = false;
    if (event.data.data.id) {
      const nuevaMarca = { _id: event.data.data.id, name_brands: event.data.data.name };
      this.brands.unshift(nuevaMarca);
      this.brandsFiltradas = [...this.brands];
      this.nuevoForm.controls['id_brand'].setValue(event.data.data.id);
    }
  }

  openModalmodel() { this.modalVisible2 = true; }
  async closeModalmodel(event: { data: any }) {
    if (event.data.close) this.modalVisible2 = false;
    if (event.data.data.id) {
      this.models = await this.apiPedido.listmodels(event.data.data.brand);
      this.modelsFiltrados = [...this.models];
      this.nuevoForm.controls['id_brand'].setValue(event.data.data.brand);
      this.nuevoForm.controls['id_model'].setValue(event.data.data.id);
    }
  }

  openModaltype() { this.modalVisible3 = true; }
  closeModaltype(event: { data: any }) {
    if (event.data.close) this.modalVisible3 = false;
    if (event.data.data.id) {
      const nuevoTipo = { _id: event.data.data.id, type_inventoryflow: event.data.data.name };
      this.types.unshift(nuevoTipo);
      this.typesFiltrados = [...this.types];
      this.nuevoForm.controls['id_type'].setValue(event.data.data.id);
    }
  }

  openModalcolor() { this.modalVisible4 = true; }
  closeModalcolor(event: { data: any }) {
    if (event.data.close) this.modalVisible4 = false;
    if (event.data.data.id) {
      const nuevoColor = { _id: event.data.data.id, color_name: event.data.data.name };
      this.colors.unshift(nuevoColor);
      this.colorsFiltrados = [...this.colors];
      this.nuevoForm.controls['id_color'].setValue(event.data.data.id);
    }
  }

  openModalquality() { this.modalVisible5 = true; }
  closeModalquality(event: { data: any }) {
    if (event.data.close) this.modalVisible5 = false;
    if (event.data.data.id) {
      const nuevaCali = { _id: event.data.data.id, quality_inventoryflow: event.data.data.name };
      this.qualitys.unshift(nuevaCali);
      this.qualitysFiltradas = [...this.qualitys];
      this.nuevoForm.controls['id_quality'].setValue(event.data.data.id);
    }
  }

  openModalstate() { this.modalVisible6 = true; }
  closeModalstate(event: { data: any }) {
    if (event.data.close) this.modalVisible6 = false;
    if (event.data.data.id) {
      const nuevoEstado = { _id: event.data.data.id, stateproduct_inventoryflow: event.data.data.name };
      this.stateproducts.unshift(nuevoEstado);
      this.stateproductsFiltrados = [...this.stateproducts];
      this.nuevoForm.controls['id_stateproduct_inventoryflow'].setValue(event.data.data.id);
    }
  }

  // ============ AUXILIARES ============

  get f(): { [key: string]: AbstractControl } {
    return this.nuevoForm.controls;
  }

  printbutton(e: any) {
    this.nuevoForm.controls['get_print'].setValue(e.checked);
  }

  onCheckboxChange(e: any) {
    this.nuevoForm.controls['cod_upc'].setValue(false);
    this.codeauto = e.checked;
  }

  print(pdf: any) {
    printJS({ printable: pdf, type: 'pdf', showModal: true });
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

  private startButtonSafetyTimer(ms: number = 8000) {
    if (this.safetyTimeoutId) clearTimeout(this.safetyTimeoutId);
    this.safetyTimeoutId = setTimeout(() => {
      if (this.isButtonDisabled) this.isButtonDisabled = false;
      this.safetyTimeoutId = null;
    }, ms);
  }

  private clearButtonSafetyTimer() {
    if (this.safetyTimeoutId) {
      clearTimeout(this.safetyTimeoutId);
      this.safetyTimeoutId = null;
    }
  }
}