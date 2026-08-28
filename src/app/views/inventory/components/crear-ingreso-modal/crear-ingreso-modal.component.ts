// components/desguace/crear-ingreso-modal/crear-ingreso-modal.component.ts

import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

export interface CrearIngresoData {
  part: any;
  deviceId: string;
}

@Component({
  selector: 'app-crear-ingreso-modal',
  templateUrl: './crear-ingreso-modal.component.html',
  styleUrls: ['./crear-ingreso-modal.component.css']
})
export class CrearIngresoModalComponent implements OnInit {
  
  @ViewChild('myInput') myInput!: ElementRef;

  ingresosaveForm!: FormGroup;
  supplierslist: any[] = [];
  typedocument: any[] = [];
  taxesnames: any[] = [];
  taxespercentaje: any[] = [];
  typedocumenttext: string = '';
  totalprice: string = '0.00';
  submitted: boolean = false;
  bloquear: boolean = false;
  isCelular: boolean = false;

  // Para búsqueda de productos
  items: any[] = [];
  terminoDeBusqueda: string = '';
  mostrarSugerencias: boolean = false;
  blockbusquedapro: boolean = false;
  loaderpro: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CrearIngresoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CrearIngresoData,
    private fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadData();
    this.setupPartData();
  }

  initForm(): void {
    const currentDate = new Date();
    
    this.ingresosaveForm = this.fb.group({
      id_proveedor: [null, Validators.required],
      // ✅ CAMBIAR: Habilitar el campo en lugar de deshabilitarlo
      tipo_documento: [{ value: '', disabled: false }], // <--- CAMBIADO
      numero_documento: [''],  // <--- SIN readonly en el HTML
      id_item: [null],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioventa: [0],
      fecha: [formatDate(currentDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US'), Validators.required],
      preciounit: [0],
      observaciones: [''],
      porcentaje: [''],
      inpuesto: [''],
      item: [''],
      get_print: [true],
      bodega: [false],
      iva: [true],
      selected_printer: ['zebra'],
      isBillableInRepairOrders: [false],
      partName: ['']
    });
  }

  async loadData(): Promise<void> {
    try {
      const data = await this.api.getdataincome();
      this.typedocument = data.dat || [];
      this.supplierslist = data.datsup || [];
      this.taxesnames = data.dattax || [];
      this.taxespercentaje = data.datpercetax || [];
      
      if (this.typedocument.length > 0) {
        const ordenType = this.typedocument.find(t => 
          t.name_type_document?.toUpperCase().includes('ORDEN')
        );
        
        // ✅ Usar setValue en lugar de patchValue para asegurar que no se deshabilite
        this.ingresosaveForm.get('tipo_documento')?.setValue(ordenType?._id || this.typedocument[0]._id);
        this.ingresosaveForm.get('porcentaje')?.setValue(this.taxespercentaje[0]?._id || '');
        this.ingresosaveForm.get('inpuesto')?.setValue(data.nametax || '');
        
        this.typedocumenttext = ordenType?.name_type_document || this.typedocument[0]?.name_type_document || '';
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.snackBar.open('❌ Error al cargar datos', 'Cerrar', { duration: 3000 });
    }
  }

setupPartData(): void {
  this.blockbusquedapro = false;

  const part = this.data.part;
  const metadata = part.metadata || {};
  const partName = part.partLabel || part.partName || '';
  const orderNumber = metadata.orderNumber || part.orderNumber || '';
  
  const numeroDocumento = orderNumber ? `ORD-${orderNumber}` : `DES-${Date.now()}`;
  
  let observaciones = `Pieza de desguace - ${partName}`;
  if (orderNumber) {
    observaciones += ` - Orden #${orderNumber}`;
  }
  if (part.value !== null && part.value !== undefined) {
    observaciones += ` - Valor: ${part.value}${part.partName === 'battery' ? '%' : 'GB'}`;
  }

  this.terminoDeBusqueda = '';

  // ✅ FORZAR HABILITACIÓN DE TODOS LOS CAMPOS
  // Primero habilitamos todos los campos del formulario
  Object.keys(this.ingresosaveForm.controls).forEach(key => {
    this.ingresosaveForm.get(key)?.enable();
  });

  this.ingresosaveForm.patchValue({
    id_item: null,
    item: '',
    partName: partName,
    observaciones: observaciones,
    preciounit: part.purchasePrice || 0,
    precioventa: part.salePrice || 0,
    numero_documento: numeroDocumento,
    cantidad: 1,
  });

  // ✅ Asegurar que el campo de búsqueda esté habilitado
  this.ingresosaveForm.get('item')?.enable();
  
  // ✅ Asegurar que tipo_documento esté habilitado
  this.ingresosaveForm.get('tipo_documento')?.enable();
  
  // ✅ Asegurar que numero_documento esté habilitado
  this.ingresosaveForm.get('numero_documento')?.enable();

  // ✅ Forzar nuevamente después de un breve momento (por si Angular los deshabilita)
  setTimeout(() => {
    Object.keys(this.ingresosaveForm.controls).forEach(key => {
      const control = this.ingresosaveForm.get(key);
      if (control && control.disabled) {
        console.warn(`⚠️ Campo ${key} estaba deshabilitado, habilitando...`);
        control.enable();
      }
    });
  }, 100);

  const itemText = partName;
  this.isCelular = itemText.toUpperCase().includes('CELULAR') || 
                    itemText.toUpperCase().includes('MOVIL') ||
                    itemText.toUpperCase().includes('SMARTPHONE');
}

  // Captura de texto mientras se escribe
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoDeBusqueda = input.value;

    if (this.terminoDeBusqueda.trim().length > 2) {
      this.mostrarSugerencias = true;
    } else {
      this.mostrarSugerencias = false;
      this.items = [];
      this.ingresosaveForm.controls['id_item'].setValue(null);
    }
  }

  changes(): void {
    const data = this.ingresosaveForm.value.tipo_documento;
    const found = this.typedocument.find((element) => element._id === data);
    this.typedocumenttext = found?.name_type_document || '';
  }

  totalpriceds(): void {
    const cant = this.ingresosaveForm.controls['cantidad'].getRawValue() || 0;
    const preciounit = this.ingresosaveForm.controls['preciounit'].getRawValue() || 0;
    const idper = this.ingresosaveForm.controls['porcentaje'].getRawValue();
    const found = this.taxespercentaje.find((element) => element._id === idper);
    const percent = found?.percentaje || 0;
    
    const calculated = ((parseFloat(percent) / 100 + 1) * parseFloat(preciounit) * parseFloat(cant));
    this.totalprice = isNaN(calculated) ? '0.00' : calculated.toFixed(2);
  }

  async findpercentaje(): Promise<void> {
    const inpuesto = this.ingresosaveForm.controls['inpuesto'].getRawValue();
    this.taxespercentaje = await this.api.getfindpercentaje(inpuesto);
    if (this.taxespercentaje.length > 0) {
      this.ingresosaveForm.controls['porcentaje'].setValue(this.taxespercentaje[0]._id);
      this.totalpriceds();
    }
  }

  // Seleccionar producto sugerido
  seleccionarSugerencia(texto: string, id_item: string): void {
    this.terminoDeBusqueda = texto;
    this.mostrarSugerencias = false;
    
    this.ingresosaveForm.patchValue({
      id_item: id_item,
      item: texto
    });
    
    this.seleccionitem();
  }

  seleccionitem(): void {
    const data = this.ingresosaveForm.controls['id_item'].getRawValue();
    const found = this.items.find(element => element._id === data);
    if (!found) return;
    const precioBase = Number(found.price ?? 0);
    const hasTax = found.hasTax !== false;
    const precioVentaFinal = hasTax
      ? precioBase
      : +(precioBase * 1.15).toFixed(2);
    this.ingresosaveForm.controls['precioventa'].setValue(precioVentaFinal);
    this.ingresosaveForm.controls['preciounit'].setValue(
      Number(found.last_unit_price_income ?? 0)
    );
  }

  filtrarSugerencias(): void {
    this.mostrarSugerencias = this.terminoDeBusqueda.length > 0;
  }

  async makechoice(event: any): Promise<void> {
    if (event === 'Enter' || event?.key === 'Enter') {
      const query = this.ingresosaveForm.get('item')?.value || this.terminoDeBusqueda;
      
      if (query && query.trim().length > 2) {
        this.loaderpro = true;
        this.mostrarSugerencias = true;
        try {
          this.items = await this.api.finditemincome(query.trim());
        } catch (error) {
          console.error('Error al buscar producto:', error);
        } finally {
          this.loaderpro = false;
        }
      }
    }
  }

  get f(): any {
    return this.ingresosaveForm.controls;
  }

  async onSubmitclose(form: any): Promise<void> {
    this.submitted = true;

    if (this.ingresosaveForm.invalid) {
      this.ingresosaveForm.markAllAsTouched();
      this.snackBar.open('❌ Complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.bloquear = true;

    try {
      const part = this.data.part;
      
      const payload = {
        id_proveedor: form.id_proveedor,
        tipo_documento: form.tipo_documento,
        numero_documento: form.numero_documento || `DES-${Date.now()}`,
        cantidad: form.cantidad || 1,
        precioventa: form.precioventa || 0,
        preciounit: form.preciounit || 0,
        observaciones: form.observaciones || `Ingreso desde desguace - ${part.partLabel || part.partName}`,
        fecha: form.fecha,
        porcentaje: form.porcentaje,
        inpuesto: form.inpuesto,
        get_print: form.get_print || false,
        bodega: form.bodega || false,
        isBillableInRepairOrders: form.isBillableInRepairOrders || false,
        item: form.item || '',
        id_item: form.id_item || null,
        // ✅ ENVIAR EL ID DE LA VERIFICACIÓN PARA ACTUALIZAR newBatchId
        verificationId: part._id,  // 👈 ESTO ES LO IMPORTANTE
      };

      const result = await this.api.saveincome(payload);

      if (result === 'OK' || (result && result.id)) {
        this.snackBar.open(`✅ Ingreso creado para ${part.partLabel || part.partName}`, 'Cerrar', { duration: 4000 });
        this.dialogRef.close({ success: true });
      } else {
        this.snackBar.open('❌ Error al crear ingreso', 'Cerrar', { duration: 3000 });
      }
    } catch (error: any) {
      console.error('Error:', error);
      this.snackBar.open(`❌ ${error?.message || 'Error al crear ingreso'}`, 'Cerrar', { duration: 5000 });
    } finally {
      this.bloquear = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }

  seleccionarTexto(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  // crear-ingreso-modal.component.ts

diagnosticarFormulario(): void {
  console.log('🩺 ========== DIAGNÓSTICO DEL FORMULARIO ==========');
  console.log('📋 Estado del formulario:', this.ingresosaveForm);
  console.log('📋 Formulario válido:', this.ingresosaveForm.valid);
  console.log('📋 Formulario disabled:', this.ingresosaveForm.disabled);
  
  // Estado de cada control
  Object.keys(this.ingresosaveForm.controls).forEach(key => {
    const control = this.ingresosaveForm.get(key);
    console.log(`  🔹 ${key}:`);
    console.log(`      value:`, control?.value);
    console.log(`      enabled: ${control?.enabled}`);
    console.log(`      disabled: ${control?.disabled}`);
    console.log(`      valid: ${control?.valid}`);
    console.log(`      errors:`, control?.errors);
  });
  
  // Verificar elementos en el DOM
  console.log('📌 ELEMENTOS EN EL DOM:');
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((el, i) => {
    const htmlEl = el as HTMLInputElement;
    console.log(`  ${i+1}. ${htmlEl.tagName} [${htmlEl.name || htmlEl.id || 'sin-nombre'}]:`);
    console.log(`      disabled: ${htmlEl.disabled}`);
    console.log(`      readonly: ${htmlEl.readOnly}`);
    console.log(`      type: ${htmlEl.type}`);
    console.log(`      value: ${htmlEl.value}`);
  });
  
  // Verificar el modal padre
  console.log('📌 MODAL PADRE:');
  const dialogContainer = document.querySelector('.cdk-overlay-pane');
  console.log('  cdk-overlay-pane:', dialogContainer);
  if (dialogContainer) {
    console.log('  pointer-events:', window.getComputedStyle(dialogContainer).pointerEvents);
  }
  
  console.log('🩺 ========== FIN DIAGNÓSTICO ==========');
}
}