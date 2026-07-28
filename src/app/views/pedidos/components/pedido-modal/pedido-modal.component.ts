import { Component, Inject, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CrearPedido } from 'src/app/service/pedido/CrearPedido.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

import { serialValidator } from 'src/app/views/income/serial-validator';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { PedidoService } from 'src/app/service/pedido/pedido.service';
import { PedidoInventarioTablaComponent } from '../pedido-inventario-tabla/pedido-inventario-tabla.component';
import { NuevoPedidoComponent } from '../nuevo-pedido/nuevo-pedido.component';

@Component({
  selector: 'app-pedido-modal',
  templateUrl: './pedido-modal.component.html',
  styleUrls: ['./pedido-modal.component.css']
})
export class PedidoModalComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<any>();
  @ViewChild('pedidoInventarioTabla') pedidoInventarioTabla!: PedidoInventarioTablaComponent;

  serialRules = [
    {
      name: 'CELULAR',
      keywords: ['CELULAR', 'MOVIL', 'SMARTPHONE'],
      requiredLength: 15,
      numericOnly: true
    }
  ];

  constructor(
    private apiPedido: CrearPedido,
    private router: Router,
    private formBuilder: FormBuilder,
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PedidoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModal: any
  ) { }

  // ✅ Formulario principal
  incomesaveForm: FormGroup = new FormGroup({
    id_proveedor: new FormControl(null, Validators.required),
    tipo_documento: new FormControl('', Validators.required),
    numero_documento: new FormControl('', Validators.required),
    id_item: new FormControl(null, Validators.required),
    cantidad: new FormControl('', Validators.required),
    precioventa: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    preciounit: new FormControl('', Validators.required),
    observaciones: new FormControl(''),
    porcentaje: new FormControl('', Validators.required),
    inpuesto: new FormControl('', Validators.required),
    item: new FormControl(''),
    get_print: new FormControl(true),
    bodega: new FormControl(false),
    iva: new FormControl(true),
    selected_printer: new FormControl(''),
    pedidoId: new FormControl(null),
    imeis: this.formBuilder.array([])
  });

  // Listas para selects
  typedocument: any[] = [];
  supplierslist: any[] = [];
  taxesnames: any[] = [];
  taxespercentaje: any[] = [];
  typedocumenttext: string = '';

  // Items para búsqueda
  items: any[] = [];
  terminoDeBusqueda: string = '';
  mostrarSugerencias: boolean = false;
  blockbusquedapro: boolean = false;
  loaderpro: boolean = false;

  // ============ PEDIDOS EN INVENTARIO ============
  pedidosInventario: any[] = [];
  pedidoSeleccionado: any = null;
  mostrarListaPedidos: boolean = false;
  loadingPedidosInventario: boolean = false;
  
  // Lista de IDs de pedidos ya seleccionados para evitar duplicados
  pedidosSeleccionadosIds: string[] = [];

  // Control de envío
  submitted: boolean = false;
  bloquear: boolean = false;
  bloquear1: boolean = false;
  isCelular: boolean = false;
  totalprice: string = '';
  myedit: boolean = true;
  precioventaConIva: number = 0;

  // Mensajes para IMEI
  imeiMessages: string[] = [];

  // Nuevo proveedor
  newproveedor: boolean = false;
  submitted1: boolean = false;
  rimpeitems: any[] = [];
  countriesitems: any[] = [];

  supplierForm: FormGroup = new FormGroup({
    RUC: new FormControl(''),
    razonsocial: new FormControl(''),
    direccion: new FormControl(''),
    telefono: new FormControl(''),
    email: new FormControl(''),
    rimpe: new FormControl(''),
    pais: new FormControl(''),
  });

  ngOnInit(): void {
    this.getdataincome();
    
    this.incomesaveForm.get('precioventa')?.valueChanges.subscribe(() => {
      this.calcularPrecioConIva();
    });

    this.incomesaveForm.get('iva')?.valueChanges.subscribe(() => {
      this.calcularPrecioConIva();
    });
  }

  // ============ VERIFICAR SI ES COMPROBANTE ============
  esComprobante(): boolean {
    const tipoDocumento = this.incomesaveForm.get('tipo_documento')?.value;
    if (!tipoDocumento) return false;
    
    const found = this.typedocument.find((element: any) => element._id == tipoDocumento);
    const nombreTipo = found?.name_type_document?.toUpperCase() || '';
    
    return nombreTipo === 'COMPROBANTE' || nombreTipo.includes('COMPROBANTE');
  }

  // ============ CALCULAR PRECIO CON IVA ============
  calcularPrecioConIva() {
    const precioVenta = Number(this.incomesaveForm.get('precioventa')?.value) || 0;
    const tieneIva = this.incomesaveForm.get('iva')?.value;

    if (tieneIva) {
      this.precioventaConIva = precioVenta;
    } else {
      this.precioventaConIva = +(precioVenta * 1.15).toFixed(2);
    }
  }

  // ============ CARGA DE DATOS ============
  async getdataincome() {
    const user = localStorage.getItem('User');
    this.mostrarSugerencias = false;
    this.blockbusquedapro = false;
    this.bloquear = false;
    this.newproveedor = false;
    this.submitted1 = false;
    this.mostrarListaPedidos = true;
    this.pedidosSeleccionadosIds = [];
    
    const data = await this.apiPedido.getdataincome();
    this.typedocument = data.dat;
    this.supplierslist = data.datsup;
    this.taxesnames = data.dattax;
    this.taxespercentaje = data.datpercetax;
    
    const currentDate = new Date();
    this.isCelular = false;
    
    this.incomesaveForm.patchValue({
      id_proveedor: null,
      id_item: null,
      tipo_documento: this.typedocument[0]?._id || '',
      numero_documento: '',
      precioventa: 0,
      cantidad: 1,
      preciounit: 0,
      observaciones: '',
      porcentaje: this.taxespercentaje[0]?._id || '',
      inpuesto: data.nametax,
      fecha: formatDate(currentDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US'),
      item: '',
      get_print: true,
      bodega: false,
      iva: true,
      selected_printer: user && user === 'byronp' ? 'dymo' : 'zebra',
      pedidoId: null
    });
    
    this.imeisArr.clear();
    this.imeiMessages = [];
    this.typedocumenttext = this.typedocument[0]?.name_type_document || '';
    this.calcularPrecioConIva();
    
    this.cargarPedidosInventario();
  }

  // ============ CARGAR PEDIDOS EN INVENTARIO ============
  async cargarPedidosInventario() {
    this.loadingPedidosInventario = true;
    try {
      const response = await this.pedidoService.getPedidosEnInventario(1, 100, '');
      this.pedidosInventario = response?.data?.pedidos || [];
      console.log('📋 Pedidos en inventario:', this.pedidosInventario.length);
    } catch (error) {
      console.error('Error al cargar pedidos en inventario:', error);
      this.pedidosInventario = [];
    } finally {
      this.loadingPedidosInventario = false;
    }
  }

  // ============ SELECCIONAR PEDIDO ============
  seleccionarPedido(pedido: any) {
    this.pedidoSeleccionado = pedido;
    this.mostrarListaPedidos = false;
    
    if (pedido._id && !this.pedidosSeleccionadosIds.includes(pedido._id)) {
      this.pedidosSeleccionadosIds.push(pedido._id);
    }
    
    this.incomesaveForm.patchValue({
      pedidoId: pedido._id,
      item: pedido.name,
      cantidad: pedido.quantity || 1,
      precioventa: pedido.estimatedPrice || 0,
      observaciones: pedido.description || '',
    });

    const itemEncontrado = this.items.find((i: any) => 
      i.nameitem?.toLowerCase().includes(pedido.name?.toLowerCase())
    );
    
    if (itemEncontrado) {
      this.incomesaveForm.patchValue({
        id_item: itemEncontrado._id
      });
    }
  }

  // ============ VOLVER A LA LISTA DE PEDIDOS ============
  volverAListaPedidos() {
    this.mostrarListaPedidos = true;
    this.pedidoSeleccionado = null;
    this.cargarPedidosInventario();
  }

  // ============================================================
  //  ✅ ABRIR MODAL DE NUEVO PRODUCTO
  // ============================================================

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  abrirNuevoProducto(): void {
    const dialogRef = this.dialog.open(NuevoPedidoComponent, {
      width: '950px',
      maxWidth: '95vw',
      disableClose: true,
      autoFocus: false
    });

    const sub = dialogRef.componentInstance.productoCreado.subscribe(async (producto: any) => {
      console.log('📦 Producto creado recibido:', producto);
      
      if (producto && producto.id) {
        await this.delay(2000);
        
        const productoData = producto.producto || {};
        const upcValue = producto.upc || productoData.upc || '';
        const nombreProducto = producto.name || productoData.name_nameitems || '';
        const idProducto = producto.id;
        const modeloProducto = productoData.modelitem?.business_model || 
                              (typeof productoData.modelitem === 'string' ? productoData.modelitem : '');
        
        let itemEncontrado = null;
        
        if (upcValue && upcValue.length > 0) {
          const results = await this.apiPedido.finditemincome(upcValue);
          if (results && results.length > 0) {
            itemEncontrado = results.find((i: any) => i._id === idProducto);
            if (itemEncontrado) {
              this.aplicarSeleccionProducto(itemEncontrado);
              return;
            }
            itemEncontrado = results.find((i: any) => i.upc === upcValue);
            if (itemEncontrado) {
              this.aplicarSeleccionProducto(itemEncontrado);
              return;
            }
          }
        }
        
        await this.recargarItems();
        itemEncontrado = this.items.find((i: any) => i._id === idProducto);
        if (itemEncontrado) {
          this.aplicarSeleccionProducto(itemEncontrado);
          return;
        }
        
        if (nombreProducto && nombreProducto.length > 2) {
          const results = await this.apiPedido.finditemincome(nombreProducto);
          if (results && results.length > 0) {
            itemEncontrado = results.find((i: any) => i._id === idProducto);
            if (itemEncontrado) {
              this.aplicarSeleccionProducto(itemEncontrado);
              return;
            }
            if (modeloProducto) {
              itemEncontrado = results.find((i: any) => 
                i.nameitem?.toUpperCase() === nombreProducto.toUpperCase() &&
                i.modelitem?.toUpperCase().includes(modeloProducto.toUpperCase())
              );
              if (itemEncontrado) {
                this.aplicarSeleccionProducto(itemEncontrado);
                return;
              }
            }
            if (upcValue) {
              itemEncontrado = results.find((i: any) => 
                i.nameitem?.toUpperCase() === nombreProducto.toUpperCase() &&
                i.upc === upcValue
              );
              if (itemEncontrado) {
                this.aplicarSeleccionProducto(itemEncontrado);
                return;
              }
            }
          }
        }
        
        const getValue = (field: any) => {
          if (!field) return '';
          if (typeof field === 'string') return field;
          if (typeof field === 'object') {
            return field.name_nameitems || 
                   field.business_model || 
                   field.type_inventoryflow || 
                   field.color_name || 
                   field.quality_inventoryflow || 
                   field.stateproduct_inventoryflow || 
                   field.name_brands || 
                   '';
          }
          return '';
        };
        
        const itemManual = {
          _id: idProducto,
          nameitem: producto.name || productoData.name_nameitems || '',
          name_nameitems: producto.name || productoData.name_nameitems || '',
          sku: producto.sku || productoData.sku || '',
          upc: upcValue,
          modelitem: getValue(productoData.modelitem),
          quality: getValue(productoData.quality),
          stateproduc: getValue(productoData.stateproduc),
          colors1: getValue(productoData.colors1),
          brand: getValue(productoData.brand),
          price: productoData.price || 0,
          hasTax: productoData.hasTax !== false,
          last_unit_price_income: productoData.last_unit_price_income || 0,
          observations: productoData.observations || '',
          ...productoData
        };
        
        this.aplicarSeleccionProducto(itemManual);
        
        const existe = this.items.some((i: any) => i._id === itemManual._id);
        if (!existe) {
          this.items.unshift(itemManual);
        }
        
        setTimeout(() => {
          this.recargarItems();
        }, 500);
        
        this.snackBar.open(`✅ Producto "${itemManual.nameitem}" seleccionado`, 'Cerrar', { duration: 3000 });
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (sub) {
        sub.unsubscribe();
      }
      if (result) {
        this.cargarPedidosInventario();
        this.snackBar.open('✅ Producto creado exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  async recargarItems(): Promise<void> {
    try {
      this.loaderpro = true;
      const results = await this.apiPedido.finditemincome('');
      this.items = results || [];
    } catch (error) {
      console.error('Error al recargar items:', error);
    } finally {
      this.loaderpro = false;
    }
  }

  private extraerSkuDelProducto(): string | null {
    const textoItem = this.incomesaveForm.get('item')?.value || '';
    const patrones = [
      /INS:\s*([A-Z0-9]+)/i,
      /SKU:\s*([A-Z0-9]+)/i,
      /COD:\s*([A-Z0-9]+)/i,
      /#([A-Z0-9]{8,})/i
    ];
    for (const patron of patrones) {
      const match = textoItem.match(patron);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  }

  private agregarYSeleccionarItem(item: any): void {
    if (!item) return;
    const existe = this.items.some((i: any) => i._id === item._id);
    if (!existe) {
      this.items.unshift(item);
    }
    this.aplicarSeleccionProducto(item);
  }

  aplicarSeleccionProducto(item: any): void {
    if (!item) return;
    
    const upc = item.upc || '';
    const sku = item.sku || '';
    const nameitem = item.nameitem || item.name_nameitems || '';
    
    let texto = upc ? `«${upc}» ${nameitem}` : nameitem;
    if (sku) {
      texto = `«${upc}» SKU: ${sku} ${nameitem}`.trim();
    }
    
    this.seleccionarSugerencia(texto, item._id);
    this.incomesaveForm.patchValue({
      item: texto,
      id_item: item._id
    });
    this.mostrarSugerencias = false;
  }

  // ============ MÉTODOS PARA IMEI ============
  get imeisArr() {
    return this.incomesaveForm.get('imeis') as FormArray;
  }

  addImei() {
    const itemName = this.incomesaveForm.get('item')?.value || '';
    const control = this.formBuilder.control('', [
      Validators.required,
      serialValidator(itemName, this.serialRules)
    ]);
    this.imeisArr.push(control);
    this.imeiMessages.push('');
  }

  removeImei(index: number) {
    this.imeisArr.removeAt(index);
    this.imeiMessages.splice(index, 1);
  }

  onImeiBlur(index: number) {
    const control = this.imeisArr.at(index);
    const errors = control.errors;
    this.imeiMessages[index] = '';

    if (!errors) {
      this.imeiMessages[index] = 'Serial válido ✔';
      return;
    }

    if (errors['serialLength']) {
      const e = errors['serialLength'];
      this.imeiMessages[index] = `Faltan ${e.missing} caracteres (necesita ${e.required}).`;
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

  // ============ BÚSQUEDA DE PRODUCTOS ============
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
        this.items = await this.apiPedido.finditemincome(this.terminoDeBusqueda);
        this.loaderpro = false;
      }
    }
    if (this.terminoDeBusqueda.length <= 2) {
      this.incomesaveForm.controls['id_item'].setValue('');
      this.items = [];
    }
  }

  seleccionarSugerencia(texto: string, id_item: string) {
    this.incomesaveForm.controls['id_item'].setValue(id_item);
    this.terminoDeBusqueda = texto;
    this.mostrarSugerencias = false;
    this.seleccionitem();
    
    this.incomesaveForm.patchValue({
      id_item: id_item,
      item: texto
    });

    const isCelular = texto.toUpperCase().includes('CELULAR') ||
                      texto.toUpperCase().includes('MOVIL') ||
                      texto.toUpperCase().includes('SMARTPHONE');
    this.isCelular = isCelular;

    if (isCelular && this.imeisArr.length === 0) {
      this.addImei();
    } else if (!isCelular) {
      this.imeisArr.clear();
    }
  }

  seleccionitem() {
    const data = this.incomesaveForm.controls['id_item'].getRawValue();
    const found = this.items.find((element: any) => element._id == data);
    if (!found) return;

    const precioBase = Number(found.price ?? 0);
    const hasTax = found.hasTax !== false;
    const precioVentaFinal = hasTax ? precioBase : +(precioBase * 1.15).toFixed(2);

    this.incomesaveForm.controls['precioventa'].setValue(precioVentaFinal);
    this.incomesaveForm.controls['preciounit'].setValue(
      Number(found.last_unit_price_income ?? 0)
    );
    this.calcularPrecioConIva();
  }

  // ============ TOTALES ============
  totalpriceds() {
    const cant = this.incomesaveForm.controls['cantidad'].getRawValue();
    const preciounit = this.incomesaveForm.controls['preciounit'].getRawValue();
    const idper = this.incomesaveForm.controls['porcentaje'].getRawValue();
    const found = this.taxespercentaje.find(
      (element: any) => element._id == idper
    )?.percentaje;
    if (found) {
      this.totalprice = (
        (parseFloat(found) / 100 + 1) *
        parseFloat(preciounit) * parseFloat(cant || 1)
      ).toFixed(2);
    }
  }

  async findpercentaje() {
    if (this.esComprobante()) {
      return;
    }
    this.taxespercentaje = await this.apiPedido.getfindpercentaje(
      this.incomesaveForm.controls['inpuesto'].getRawValue()
    );
    this.incomesaveForm.controls['porcentaje'].setValue(
      this.taxespercentaje[0]?._id || ''
    );
  }

  changes() {
    const data = this.incomesaveForm.value.tipo_documento;
    const found = this.typedocument.find((element: any) => element._id == data);
    this.typedocumenttext = found?.name_type_document || '';
    
    if (this.esComprobante()) {
      if (this.taxesnames.length > 0 && this.taxespercentaje.length > 0) {
        this.incomesaveForm.patchValue({
          inpuesto: this.taxesnames[0]?._id || '',
          porcentaje: this.taxespercentaje[0]?._id || ''
        });
      }
    }
  }

  // ============ NUEVO PROVEEDOR ============
  async nuevoproveedor() {
    if (!this.newproveedor) {
      this.newproveedor = true;
      const datanew = await this.apiPedido.getdatanewsupplier();
      this.rimpeitems = datanew.rimpe;
      this.countriesitems = datanew.countries;
      this.supplierForm = this.formBuilder.group({
        RUC: [''],
        razonsocial: [null, Validators.required],
        direccion: [''],
        telefono: [''],
        email: [''],
        rimpe: [
          this.rimpeitems.find((element: any) => element.name_rimpe == 'NO')?._id,
          Validators.required,
        ],
        pais: [
          this.countriesitems.find(
            (element: any) => element.name_countrie == 'ECUADOR'
          )?._id,
          Validators.required,
        ],
      });
    } else {
      this.submitted1 = false;
      this.newproveedor = false;
    }
  }

  async savesupplier(form: any) {
    this.submitted1 = true;
    if (this.supplierForm.invalid) {
      return;
    } else {
      const data = await this.apiPedido.savesuppliersincome(form);
      if (data == 'OK') {
        const dataIncome = await this.apiPedido.getdataincome();
        this.supplierslist = dataIncome.datsup;
        this.newproveedor = false;
        this.submitted1 = false;
      }
    }
  }

  // ============ FUNCIONES AUXILIARES ============
  private extraerBatchId(data: any): string | null {
    if (!data) return null;
    const rutas = [
      () => data.batchId,
      () => data.data?.batchId,
      () => data.batch?._id,
      () => data.data?.batch?._id,
      () => data.incomeId,
      () => data.data?.incomeId,
      () => data.id,
      () => data._id
    ];
    for (const ruta of rutas) {
      try {
        const valor = ruta();
        if (valor && typeof valor === 'string' && valor.length > 8) {
          return valor;
        }
      } catch (e) {}
    }
    return null;
  }

  private extraerSku(data: any): string | null {
    if (!data) return null;
    const rutas = [
      () => data.sku,
      () => data.data?.sku,
      () => data.inventoryflow?.sku,
      () => data.data?.inventoryflow?.sku,
      () => data.batch?.sku,
      () => data.data?.batch?.sku,
    ];
    for (const ruta of rutas) {
      try {
        const valor = ruta();
        if (valor && typeof valor === 'string') {
          return valor;
        }
      } catch (e) {}
    }
    return null;
  }

  // ============================================================
  //  ✅ NUEVOS MÉTODOS PARA IMPRESIÓN
  // ============================================================

  /**
   * Imprime el ticket usando los datos del backend
   */
  private async imprimirTicket(data: any): Promise<void> {
    try {
      console.log('🖨️ Iniciando proceso de impresión...');
      
      const printData = data?.print;
      const incomeId = data?.incomeId || data?.id;
      
      if (!printData || !printData.id) {
        console.warn('⚠️ No hay datos de impresión disponibles');
        this.snackBar.open('⚠️ Ingreso guardado, pero no se pudo imprimir', 'Cerrar', { duration: 3000 });
        return;
      }

      console.log('🖨️ Datos de impresión:', printData);
      console.log('🖨️ Tipo de impresora:', printData.printer);

      const { id, printer } = printData;

      // Construir parámetros
      const params = new URLSearchParams();
      if (id.topText1) params.append('topText1', id.topText1);
      if (id.topText2) params.append('topText2', id.topText2);
      if (id.bottomText1) params.append('bottomText1', id.bottomText1);
      if (id.cant) params.append('cant', String(id.cant));
      if (id.qrText) params.append('qrText', id.qrText);
      if (id.price) params.append('price', String(id.price));
      if (id.f) params.append('f', id.f);
      if (id.iva !== undefined) params.append('iva', String(id.iva));
      if (incomeId) params.append('id', incomeId);

      const url = `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;
      console.log('🌐 URL de impresión:', url);

      if (printer === 'dymo') {
        // DYMO - usar el servicio
        console.log('🖨️ Imprimiendo en Dymo...');
        try {
          await this.apiPedido.printticketlocal({ id: incomeId });
          console.log('✅ Impresión Dymo enviada');
          this.snackBar.open('🖨️ Imprimiendo en Dymo...', 'Cerrar', { duration: 2000 });
        } catch (error) {
          console.error('❌ Error en Dymo, fallback a normal:', error);
          this.abrirVentanaImpresion(url);
        }
      } else {
        // ZEBRA / NORMAL
        console.log('🖨️ Imprimiendo en Zebra/Normal...');
        this.abrirVentanaImpresion(url);
        this.snackBar.open('🖨️ Enviando a imprimir...', 'Cerrar', { duration: 2000 });
      }

    } catch (error) {
      console.error('❌ Error en imprimirTicket:', error);
      this.snackBar.open('⚠️ Error al imprimir, pero el ingreso fue guardado', 'Cerrar', { duration: 3000 });
    }
  }

  /**
   * Abre ventana de impresión con fallback
   */
  private abrirVentanaImpresion(url: string): void {
    try {
      const ventana = window.open(url, '_blank');
      if (!ventana) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('❌ Error al abrir ventana:', error);
      this.snackBar.open('⚠️ No se pudo abrir la ventana de impresión', 'Cerrar', { duration: 3000 });
    }
  }

  /**
   * Limpia el formulario
   */
  private limpiarFormulario(): void {
    this.terminoDeBusqueda = '';
    this.submitted = false;
    this.pedidoSeleccionado = null;
    this.mostrarListaPedidos = true;
    
    this.incomesaveForm.patchValue({
      id_item: null,
      cantidad: 1,
      precioventa: 0,
      preciounit: 0,
      observaciones: '',
      item: '',
      pedidoId: null
    });
    
    this.imeisArr.clear();
    this.imeiMessages = [];
    this.isCelular = false;
    this.cargarPedidosInventario();
  }

  // ============================================================
  //  ✅ GUARDAR (CERRANDO) - CORREGIDO
  // ============================================================

  async onSubmitclose(form: any) {
    if (!form.numero_documento || form.numero_documento.trim() === '') {
      this.snackBar.open('❌ El número de documento es requerido', 'Cerrar', { duration: 3000 });
      return;
    }
    
    if (!form.id_proveedor) {
      this.snackBar.open('❌ Debes seleccionar un proveedor', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.isCelular) {
      if (this.imeisArr.length === 0) {
        this.snackBar.open('❌ Debes ingresar al menos un IMEI', 'Cerrar', { duration: 3000 });
        return;
      }
      for (let imei of this.imeisArr.controls) {
        if (imei.invalid) {
          this.snackBar.open('❌ IMEI inválido', 'Cerrar', { duration: 3000 });
          return;
        }
      }
    }
    
    this.submitted = true;
    this.bloquear = true;
    this.bloquear1 = true;

    if (this.incomesaveForm.invalid) {
      this.bloquear = false;
      this.bloquear1 = false;
      return;
    }

    try {
      this.myedit = false;
      const data = await this.apiPedido.saveincome(form);
      console.log('📦 Respuesta del servidor:', JSON.stringify(data, null, 2));
      
      this.bloquear = false;
      this.bloquear1 = false;

      if (data?.success || data?.id || data?.batchId) {
        
        // Asignar SKU y Batch al pedido
        if (this.pedidoSeleccionado) {
          try {
            const batchId = data.batchId || this.extraerBatchId(data);
            let sku = data.sku || this.extraerSku(data);
            if (!sku) {
              const itemId = this.incomesaveForm.get('id_item')?.value;
              const item = this.items.find((i: any) => i._id === itemId);
              sku = item?.sku || form.item || `PROD-${Date.now()}`;
            }
            if (batchId && sku) {
              await this.pedidoService.asignarSkuYBatch(
                this.pedidoSeleccionado._id,
                { sku, batchId, actualPrice: form.precioventa || 0 }
              );
            }
          } catch (error) {
            console.error('Error al asignar SKU y Batch:', error);
          }
        }

        // ✅ IMPRIMIR TICKET
        await this.imprimirTicket(data);

        // Limpiar y cerrar
        this.limpiarFormulario();
        this.submitted = false;
        this.closeModalEvent.emit({ reload: true });
        this.dialogRef.close(true);
        this.snackBar.open('✅ Ingreso guardado exitosamente', 'Cerrar', { duration: 3000 });
      }
    } catch (error) {
      console.error('Error en onSubmitclose:', error);
      this.bloquear = false;
      this.bloquear1 = false;
      this.snackBar.open('❌ Error al guardar el ingreso', 'Cerrar', { duration: 3000 });
    }
  }

  // ============================================================
  //  ✅ GUARDAR (SIN CERRAR) - CORREGIDO
  // ============================================================

  async onSubmitcloseoff(form: any) {
    console.log('📦 Formulario a enviar:', form);
    
    if (!form.numero_documento || form.numero_documento.trim() === '') {
      this.snackBar.open('❌ El número de documento es requerido', 'Cerrar', { duration: 3000 });
      this.bloquear = false;
      this.bloquear1 = false;
      return;
    }
    
    if (!form.id_proveedor) {
      this.snackBar.open('❌ Debes seleccionar un proveedor', 'Cerrar', { duration: 3000 });
      this.bloquear = false;
      this.bloquear1 = false;
      return;
    }

    if (this.isCelular) {
      if (this.imeisArr.length === 0) {
        this.snackBar.open('❌ Debes ingresar al menos un IMEI', 'Cerrar', { duration: 3000 });
        return;
      }
      for (let imei of this.imeisArr.controls) {
        if (imei.invalid) {
          this.snackBar.open('❌ IMEI inválido', 'Cerrar', { duration: 3000 });
          return;
        }
      }
    }
    
    this.submitted = true;
    this.bloquear = true;
    this.bloquear1 = true;

    if (this.incomesaveForm.invalid) {
      this.bloquear = false;
      this.bloquear1 = false;
      return;
    }

    try {
      this.myedit = false;
      const data = await this.apiPedido.saveincome(form);
      console.log('📦 Respuesta COMPLETA del servidor:', JSON.stringify(data, null, 2));
      
      this.bloquear = false;
      this.bloquear1 = false;

      if (data?.success || data?.id || data?.batchId) {
        
        // Asignar SKU y Batch al pedido
        if (this.pedidoSeleccionado) {
          try {
            const batchId = data.batchId || this.extraerBatchId(data);
            let sku = data.sku || this.extraerSku(data);
            if (!sku) {
              const itemId = this.incomesaveForm.get('id_item')?.value;
              const item = this.items.find((i: any) => i._id === itemId);
              sku = item?.sku || form.item || `PROD-${Date.now()}`;
            }
            if (batchId && sku) {
              await this.pedidoService.asignarSkuYBatch(
                this.pedidoSeleccionado._id,
                { sku, batchId, actualPrice: form.precioventa || 0 }
              );
            }
          } catch (error) {
            console.error('Error al asignar SKU y Batch:', error);
          }
        }

        // ✅ IMPRIMIR TICKET
        await this.imprimirTicket(data);

        // Limpiar formulario (sin cerrar)
        this.limpiarFormulario();
        this.submitted = false;
        this.closeModalEvent.emit({ reload: true });
        this.snackBar.open('✅ Ingreso guardado exitosamente', 'Cerrar', { duration: 3000 });
      }
    } catch (error: any) {
      console.error('❌ Error en onSubmitcloseoff:', error);
      this.bloquear = false;
      this.bloquear1 = false;
      const errorMsg = error.response?.data?.message || error.message || 'Error al guardar el ingreso';
      this.snackBar.open(`❌ ${errorMsg}`, 'Cerrar', { duration: 5000 });
    }
  }

  // ============ GETTERS ============
  get f(): { [key: string]: AbstractControl } {
    return this.incomesaveForm.controls;
  }

  get f1(): { [key: string]: AbstractControl } {
    return this.supplierForm.controls;
  }

  seleccionarTexto(event: Event) {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  onSearchInput(event: any) {
    this.terminoDeBusqueda = event.target.value;
  }

  // ============ CIERRE DEL MODAL ============
  onModalClose(): void {
    this.pedidosSeleccionadosIds = [];
    this.cargarPedidosInventario();
  }
}