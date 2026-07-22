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
    
    // Buscar el tipo de documento en la lista
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
  //  ✅ ABRIR MODAL DE NUEVO PRODUCTO - BUSCA POR UPC PRIMERO
  // ============================================================

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * ✅ Abre el modal de Nuevo Producto
   * PRIMERO busca por UPC, luego por ID, luego por nombre, luego construye manual
   */
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
        // ✅ ESPERAR 2 SEGUNDOS PARA QUE EL PRODUCTO ESTÉ DISPONIBLE
        await this.delay(2000);
        
        const productoData = producto.producto || {};
        const upcValue = producto.upc || productoData.upc || '';
        const nombreProducto = producto.name || productoData.name_nameitems || '';
        const idProducto = producto.id;
        const modeloProducto = productoData.modelitem?.business_model || 
                              (typeof productoData.modelitem === 'string' ? productoData.modelitem : '');
        
        console.log('🔍 UPC del producto creado:', upcValue);
        console.log('🔍 Nombre del producto creado:', nombreProducto);
        console.log('🔍 ID del producto creado:', idProducto);
        console.log('🔍 Modelo del producto creado:', modeloProducto);
        
        let itemEncontrado = null;
        
        // ✅ PRIMERO: Buscar por UPC (MÁS ESPECÍFICO)
        if (upcValue && upcValue.length > 0) {
          console.log('🔍 Buscando por UPC:', upcValue);
          const results = await this.apiPedido.finditemincome(upcValue);
          console.log('📦 Resultados de búsqueda por UPC:', results.length);
          
          if (results && results.length > 0) {
            // Buscar por ID exacto
            itemEncontrado = results.find((i: any) => i._id === idProducto);
            if (itemEncontrado) {
              console.log('✅ Producto encontrado por ID:', itemEncontrado);
              this.aplicarSeleccionProducto(itemEncontrado);
              return;
            }
            // Buscar por UPC exacto
            itemEncontrado = results.find((i: any) => i.upc === upcValue);
            if (itemEncontrado) {
              console.log('✅ Producto encontrado por UPC:', itemEncontrado);
              this.aplicarSeleccionProducto(itemEncontrado);
              return;
            }
          }
        }
        
        // ✅ SEGUNDO: Buscar por ID en todos los items (recargar lista)
        console.log('🔍 Buscando por ID en todos los items...');
        await this.recargarItems();
        itemEncontrado = this.items.find((i: any) => i._id === idProducto);
        if (itemEncontrado) {
          console.log('✅ Producto encontrado por ID en lista:', itemEncontrado);
          this.aplicarSeleccionProducto(itemEncontrado);
          return;
        }
        
        // ✅ TERCERO: Buscar por nombre y filtrar por ID
        if (nombreProducto && nombreProducto.length > 2) {
          console.log('🔍 Buscando por nombre:', nombreProducto);
          const results = await this.apiPedido.finditemincome(nombreProducto);
          console.log('📦 Resultados de búsqueda por nombre:', results.length);
          
          if (results && results.length > 0) {
            // Buscar por ID exacto
            itemEncontrado = results.find((i: any) => i._id === idProducto);
            if (itemEncontrado) {
              console.log('✅ Producto encontrado por ID en resultados:', itemEncontrado);
              this.aplicarSeleccionProducto(itemEncontrado);
              return;
            }
            
            // Si no encuentra por ID, buscar por nombre + modelo
            if (modeloProducto) {
              itemEncontrado = results.find((i: any) => 
                i.nameitem?.toUpperCase() === nombreProducto.toUpperCase() &&
                i.modelitem?.toUpperCase().includes(modeloProducto.toUpperCase())
              );
              if (itemEncontrado) {
                console.log('✅ Producto encontrado por nombre y modelo:', itemEncontrado);
                this.aplicarSeleccionProducto(itemEncontrado);
                return;
              }
            }
            
            // Buscar por nombre exacto y que tenga el UPC (si tenemos UPC)
            if (upcValue) {
              itemEncontrado = results.find((i: any) => 
                i.nameitem?.toUpperCase() === nombreProducto.toUpperCase() &&
                i.upc === upcValue
              );
              if (itemEncontrado) {
                console.log('✅ Producto encontrado por nombre y UPC:', itemEncontrado);
                this.aplicarSeleccionProducto(itemEncontrado);
                return;
              }
            }
          }
        }
        
        // ✅ CUARTO: Construir manualmente con los datos del modal
        console.log('⚠️ Producto no encontrado en API, construyendo manualmente...');
        
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
        
        console.log('📦 Item construido manualmente:', itemManual);
        this.aplicarSeleccionProducto(itemManual);
        
        // ✅ Agregar a la lista local
        const existe = this.items.some((i: any) => i._id === itemManual._id);
        if (!existe) {
          this.items.unshift(itemManual);
          console.log('✅ Producto agregado a la lista local');
        }
        
        // ✅ Recargar lista en segundo plano
        setTimeout(() => {
          this.recargarItems();
        }, 500);
        
        const mensaje = `✅ Producto "${itemManual.nameitem}" seleccionado ${upcValue ? `(UPC: ${upcValue})` : ''}`;
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
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

  /**
   * ✅ Recargar la lista de items para búsqueda
   */
  async recargarItems(): Promise<void> {
    try {
      this.loaderpro = true;
      
      const results = await this.apiPedido.finditemincome('');
      this.items = results || [];
      console.log('📋 Items recargados:', this.items.length);
      
      const skuEnFormulario = this.extraerSkuDelProducto();
      if (skuEnFormulario) {
        console.log('🔍 Buscando por SKU en recarga:', skuEnFormulario);
        const skuResults = await this.apiPedido.finditemincome(skuEnFormulario);
        
        if (skuResults && skuResults.length > 0) {
          const combined = [...this.items, ...skuResults];
          const unique = combined.filter((item: any, index: number, self: any[]) => 
            index === self.findIndex((i: any) => i._id === item._id)
          );
          this.items = unique;
          console.log('📋 Items combinados con SKU:', this.items.length);
        }
      }
      
      if (this.terminoDeBusqueda && this.terminoDeBusqueda.length > 2) {
        const searchResults = await this.apiPedido.finditemincome(this.terminoDeBusqueda);
        const combined = [...this.items, ...(searchResults || [])];
        const unique = combined.filter((item: any, index: number, self: any[]) => 
          index === self.findIndex((i: any) => i._id === item._id)
        );
        this.items = unique;
        console.log('📋 Items combinados con búsqueda:', this.items.length);
      }
    } catch (error) {
      console.error('Error al recargar items:', error);
    } finally {
      this.loaderpro = false;
    }
  }

  /**
   * ✅ Busca un producto por ID o NOMBRE - MÉTODO DE RESPALDO
   */
  async buscarYSeleccionarProducto(productId: string, nombreProducto?: string): Promise<void> {
    try {
      this.loaderpro = true;
      console.log('🔍 Buscando producto por ID:', productId);
      console.log('🔍 Nombre del producto:', nombreProducto);
      
      let item = null;
      
      item = this.items.find((i: any) => i._id === productId);
      
      if (item) {
        console.log('✅ Producto encontrado en lista local por ID:', item);
        this.agregarYSeleccionarItem(item);
        return;
      }
      
      if (nombreProducto && nombreProducto.length > 2) {
        console.log('🔍 Buscando por nombre en API:', nombreProducto);
        const results = await this.apiPedido.finditemincome(nombreProducto);
        console.log('📦 Resultados de búsqueda por nombre en API:', results.length);
        
        if (results && results.length > 0) {
          item = results.find((i: any) => i._id === productId);
          if (!item) {
            item = results.find((i: any) => 
              i.nameitem?.toUpperCase() === nombreProducto.toUpperCase() ||
              i.name_nameitems?.toUpperCase() === nombreProducto.toUpperCase()
            );
          }
          if (item) {
            console.log('✅ Producto encontrado en API:', item);
            this.agregarYSeleccionarItem(item);
            return;
          }
        }
      }
      
      console.log('🔍 Recargando lista completa...');
      await this.recargarItems();
      
      item = this.items.find((i: any) => i._id === productId);
      
      if (!item && nombreProducto) {
        item = this.items.find((i: any) => 
          i.nameitem?.toUpperCase() === nombreProducto.toUpperCase() ||
          i.name_nameitems?.toUpperCase() === nombreProducto.toUpperCase() ||
          i.nameitem?.toLowerCase().includes(nombreProducto.toLowerCase()) ||
          i.name_nameitems?.toLowerCase().includes(nombreProducto.toLowerCase())
        );
      }
      
      if (item) {
        console.log('✅ Producto encontrado después de recargar:', item);
        this.agregarYSeleccionarItem(item);
      } else {
        console.warn('⚠️ Producto no encontrado:', productId);
        this.snackBar.open('❌ Producto no encontrado, intenta buscarlo manualmente', 'Cerrar', { duration: 3000 });
      }
      
    } catch (error) {
      console.error('❌ Error al buscar producto:', error);
    } finally {
      this.loaderpro = false;
    }
  }

  /**
   * ✅ Extrae el SKU del producto desde el formulario
   */
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
    
    const itemId = this.incomesaveForm.get('id_item')?.value;
    if (itemId) {
      const item = this.items.find((i: any) => i._id === itemId);
      if (item && item.sku) {
        return item.sku;
      }
    }
    
    return null;
  }

  /**
   * ✅ Extrae la parte del SKU después de "INS:"
   */
  private extraerParteSku(sku: string): string | null {
    if (!sku) return null;
    const match = sku.match(/INS:\s*([A-Z0-9]+)/i);
    if (match && match[1]) {
      return match[1].trim();
    }
    return sku;
  }

  /**
   * ✅ Agrega un item a la lista y lo selecciona
   */
  private agregarYSeleccionarItem(item: any): void {
    if (!item) {
      console.warn('⚠️ Item vacío, no se puede seleccionar');
      return;
    }
    
    console.log('✅ Producto encontrado:', item);
    
    const existe = this.items.some((i: any) => i._id === item._id);
    if (!existe) {
      this.items.unshift(item);
      console.log('✅ Producto agregado a la lista de items');
    }
    
    this.aplicarSeleccionProducto(item);
  }

  /**
   * ✅ Aplica la selección del producto en el formulario
   */
  aplicarSeleccionProducto(item: any): void {
    if (!item) {
      console.warn('⚠️ Item vacío, no se puede seleccionar');
      return;
    }
    
    console.log('✅ Aplicando selección del producto:', item);
    
    const upc = item.upc || '';
    const sku = item.sku || '';
    const nameitem = item.nameitem || item.name_nameitems || '';
    const modelitem = item.modelitem || '';
    const quality = item.quality || '';
    const stateproduc = item.stateproduc || '';
    const colors1 = item.colors1 || '';
    
    console.log('🔍 UPC del item seleccionado:', upc);
    console.log('🔍 SKU del item seleccionado:', sku);
    console.log('🔍 Nombre del item seleccionado:', nameitem);
    console.log('🔍 Modelo del item seleccionado:', modelitem);
    
    // ✅ CONSTRUIR TEXTO CON UPC
    let texto = '';
    if (upc) {
      texto = `«${upc}» ${nameitem}`;
    } else {
      texto = nameitem;
    }
    
    // ✅ Si tiene SKU, agregarlo
    if (sku) {
      texto = `«${upc}» SKU: ${sku} ${nameitem}`.trim();
    }
    
    console.log('📝 Texto a seleccionar:', texto);
    
    this.seleccionarSugerencia(texto, item._id);
    
    this.incomesaveForm.patchValue({
      item: texto,
      id_item: item._id
    });
    
    this.mostrarSugerencias = false;
    
    const mensaje = `✅ Producto "${nameitem || item.name_nameitems}" seleccionado ${upc ? `(UPC: ${upc})` : ''}`;
    this.snackBar.open(mensaje, 'Cerrar', { duration: 2000 });
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
        
        console.log(`🔍 Resultados de búsqueda para: "${this.terminoDeBusqueda}"`);
        console.log(`📦 Total de resultados: ${this.items.length}`);
        
        if (this.items.length > 0) {
          console.log('📋 Lista de resultados:');
          this.items.forEach((item: any, index: number) => {
            console.log(`  ${index + 1}. ID: ${item._id} | Nombre: ${item.nameitem || item.name_nameitems} | UPC: "${item.upc || 'NO TIENE'}"`);
          });
        }
        
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
    // ✅ Si es COMPROBANTE, no hacer nada
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
    
    // ✅ Si es COMPROBANTE, establecer valores por defecto en impuestos
    if (this.esComprobante()) {
      // Establecer valores por defecto (primer impuesto y porcentaje)
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
    if (typeof data === 'string') return null;

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
          console.log('✅ batchId encontrado:', valor);
          return valor;
        }
      } catch (e) {}
    }
    return null;
  }

  private extraerSku(data: any): string | null {
    if (!data) return null;
    if (typeof data === 'string') return null;

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
          console.log('✅ SKU encontrado:', valor);
          return valor;
        }
      } catch (e) {}
    }
    return null;
  }

  // ============ GUARDAR ============
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
      if (this.imeisArr.length === 0) return;
      for (let imei of this.imeisArr.controls) {
        if (imei.invalid) return;
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
      return;
    } else {
      this.myedit = false;
      try {
        const data = await this.apiPedido.saveincome(form);

        if (data == 'OK' || data.id || data.batchId) {
          if (this.pedidoSeleccionado) {
            try {
              console.log('📦 Respuesta del servidor:', JSON.stringify(data, null, 2));
              
              const batchId = this.extraerBatchId(data);
              let sku = this.extraerSku(data);
              
              if (!sku) {
                const itemId = this.incomesaveForm.get('id_item')?.value;
                const item = this.items.find((i: any) => i._id === itemId);
                sku = item?.sku || form.item || `PROD-${Date.now()}`;
              }
              
              console.log('🔍 BatchId encontrado:', batchId);
              console.log('🔍 SKU encontrado:', sku);
              console.log('🔍 Pedido ID:', this.pedidoSeleccionado._id);
              
              if (batchId && sku) {
                const actualPrice = form.precioventa || 0;
                
                const resultado = await this.pedidoService.asignarSkuYBatch(
                  this.pedidoSeleccionado._id,
                  {
                    sku: sku,
                    batchId: batchId,
                    actualPrice: actualPrice
                  }
                );
                
                console.log('✅ Pedido actualizado con SKU y Batch:', resultado);
              } else {
                console.warn('⚠️ No se pudo asignar SKU y Batch: falta batchId o sku');
              }
            } catch (error) {
              console.error('Error al asignar SKU y Batch:', error);
            }
          }

          if (data.id) {
            const params = new URLSearchParams(data.id);
            const url = `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;
            window.open(url, '_blank');
          }
          this.submitted = false;
          this.closeModalEvent.emit({ reload: true });
          this.dialogRef.close(true);
        }
      } catch (error) {
        console.error('Error en onSubmitclose:', error);
        this.bloquear = false;
        this.bloquear1 = false;
      }
    }
  }

  async onSubmitcloseoff(form: any) {
    console.log('📦 Formulario a enviar:', form);
    console.log('📦 id_proveedor:', form.id_proveedor);
    console.log('📦 id_item:', form.id_item);
    console.log('📦 cantidad:', form.cantidad);
    console.log('📦 precioventa:', form.precioventa);
    console.log('📦 numero_documento:', form.numero_documento);
    
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
      if (this.imeisArr.length === 0) return;
      for (let imei of this.imeisArr.controls) {
        if (imei.invalid) return;
      }
    }
    
    this.submitted = true;
    this.bloquear = true;
    this.bloquear1 = true;

    if (this.incomesaveForm.invalid) {
      return;
    } else {
      this.myedit = false;
      let data;
      try {
        data = await this.apiPedido.saveincome(form);
        this.bloquear = false;
        this.bloquear1 = false;
      } catch (error: any) {
        console.error('❌ Error en saveincome:', error);
        console.error('❌ Detalles:', error.response?.data);
        this.bloquear = false;
        this.bloquear1 = false;
        
        const errorMsg = error.response?.data?.message || error.message || 'Error al guardar el ingreso';
        this.snackBar?.open(`❌ ${errorMsg}`, 'Cerrar', { duration: 5000 });
        return;
      }

      if (data == 'OK' || data.id || data.batchId) {
        if (this.pedidoSeleccionado) {
          try {
            console.log('📦 Respuesta COMPLETA del servidor:', JSON.stringify(data, null, 2));
            
            const batchId = this.extraerBatchId(data);
            let sku = this.extraerSku(data);
            
            if (!sku) {
              const itemId = this.incomesaveForm.get('id_item')?.value;
              const item = this.items.find((i: any) => i._id === itemId);
              sku = item?.sku || form.item || `PROD-${Date.now()}`;
            }
            
            console.log('🔍 BatchId encontrado:', batchId);
            console.log('🔍 SKU encontrado:', sku);
            console.log('🔍 Pedido ID:', this.pedidoSeleccionado._id);
            
            if (batchId && sku) {
              const actualPrice = form.precioventa || 0;
              
              const resultado = await this.pedidoService.asignarSkuYBatch(
                this.pedidoSeleccionado._id,
                {
                  sku: sku,
                  batchId: batchId,
                  actualPrice: actualPrice
                }
              );
              
              console.log('✅ Pedido actualizado con SKU y Batch:', resultado);
            } else {
              console.warn('⚠️ No se pudo asignar SKU y Batch: falta batchId o sku');
            }
          } catch (error) {
            console.error('Error al asignar SKU y Batch:', error);
          }
        }

        if (data.id) {
          const params = new URLSearchParams(data.id);
          const url = `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;
          window.open(url, '_blank');
        }
        this.terminoDeBusqueda = '';
        this.submitted = false;
        this.incomesaveForm.controls['id_item'].setValue(null);
        this.incomesaveForm.controls['cantidad'].setValue(1);
        this.incomesaveForm.controls['precioventa'].setValue(0);
        this.incomesaveForm.controls['preciounit'].setValue(0);
        this.incomesaveForm.controls['observaciones'].setValue('');
        this.imeisArr.clear();
        this.closeModalEvent.emit({ reload: true });
      }
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