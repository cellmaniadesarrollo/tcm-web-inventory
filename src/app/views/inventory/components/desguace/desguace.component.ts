// components/desguace/desguace.component.ts

import { Component, OnInit, Input, Output, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { DeviceVerificationService } from 'src/app/service/device-verification/device-verification.service';
import { CrearIngresoModalComponent } from '../crear-ingreso-modal/crear-ingreso-modal.component';

@Component({
  selector: 'app-desguace',
  templateUrl: './desguace.component.html',
  styleUrls: ['./desguace.component.css']
})
export class DesguaceComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() deviceId: string = '';
  @Output() close = new EventEmitter<void>();

  // Configuración columnas MatTable
  displayedColumns: string[] = ['part', 'status', 'device', 'customer', 'order', 'sku', 'value', 'actions'];

  // Datos
  verifications: any[] = [];
  selectedBatch: any = null;
  batches: any[] = [];
  
  // Estados
  isLoading = false;
  isBatchLoading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private deviceVerificationService: DeviceVerificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.deviceId) {
      this.loadBatchesByDevice();
    }
  }

  ngAfterViewInit(): void {
    // ✅ Forzar que el contenedor del desguace no capture eventos de teclado
    const container = document.querySelector('.desguace-container');
    if (container) {
      (container as HTMLElement).style.pointerEvents = 'auto';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  compareBatches(b1: any, b2: any): boolean {
    return b1 && b2 ? (b1.realId || b1._id) === (b2.realId || b2._id) : b1 === b2;
  }

  async loadBatchesByDevice(): Promise<void> {
    console.log('🔍 Cargando batches para deviceId:', this.deviceId);

    if (!this.deviceId) return;

    this.isBatchLoading = true;
    try {
      const response = await this.api.movementoutdata(this.deviceId);
      
      console.log('📦 Respuesta API movementoutdata:', response);

      if (response && response.batches) {
        this.batches = response.batches.map((batch: any) => ({
          ...batch,
          realId: batch.batchId || batch._id,
          displayName: `Lote ${batch.batchNumber} - ${batch.batchSku || batch.sku || 'N/A'}`
        }));

        console.log('✅ Batches procesados para la lista:', this.batches);
        
        if (this.batches.length === 1) {
          this.onBatchSelected(this.batches[0]);
        }
      }
    } catch (error: any) {
      console.error('Error cargando batches:', error);
      this.snackBar.open('❌ Error al cargar batches', 'Cerrar', { duration: 3000 });
    } finally {
      this.isBatchLoading = false;
    }
  }

  onBatchSelected(batchOrEvent: any): void {
    const batch = batchOrEvent?.value !== undefined ? batchOrEvent.value : batchOrEvent;

    if (!batch) {
      this.selectedBatch = null;
      this.verifications = [];
      return;
    }

    const batchRealId = batch.realId || batch.batchId || batch._id;
    
    if (!batchRealId) {
      console.error('❌ No se encontró el ID real del batch:', batch);
      this.snackBar.open('❌ Error: ID de batch no válido', 'Cerrar', { duration: 3000 });
      return;
    }

    this.selectedBatch = batch;
    this.isLoading = true;

    this.deviceVerificationService.getBatchWithVerifications(batchRealId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.verifications = response.data?.verifications || [];
            
            const good = response.data?.goodCount || 0;
            const bad = response.data?.badCount || 0;
            this.snackBar.open(
              `📦 Batch #${this.selectedBatch?.batchNumber || 'N/A'}: ${this.verifications.length} partes (✅ ${good} buenas, ❌ ${bad} malas)`,
              'Cerrar',
              { duration: 4000 }
            );
          }
        },
        error: (error: any) => {
          console.error('Error cargando verificaciones:', error);
          if (error.error?.message) {
            this.snackBar.open(`❌ ${error.error.message}`, 'Cerrar', { duration: 3000 });
          } else {
            this.snackBar.open('❌ Error al cargar verificaciones', 'Cerrar', { duration: 3000 });
          }
        }
      });
  }

  abrirModalCrearIngreso(part: any): void {
    if (!part) return;

    // ✅ Validar si ya fue procesado
    if (part.newBatchId) {
      this.snackBar.open('✅ Esta parte ya fue procesada y tiene un ingreso creado', 'Cerrar', { duration: 3000 });
      return;
    }

    if (part.status === 'MALA') {
      this.snackBar.open('❌ No se puede crear ingreso de una parte en estado MALA', 'Cerrar', { duration: 3000 });
      return;
    }

    // ✅ 1. Cerrar el modal padre (el que contiene el desguace)
    // Buscar el botón de cerrar del modal padre
    const closeButton = document.querySelector('#nuevoprocedenciamodal .btn-close') as HTMLElement;
    if (closeButton) {
      closeButton.click();
    }

    // ✅ 2. Esperar a que el modal padre se cierre
    setTimeout(() => {
      // ✅ 3. Abrir el modal hijo en el nivel raíz
      const dialogRef = this.dialog.open(CrearIngresoModalComponent, {
        width: '750px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'modal-sobre-modal-fix',
        hasBackdrop: true,
        autoFocus: 'dialog',
        restoreFocus: false,
        data: {
          part: part,
          deviceId: this.deviceId,
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.success) {
          this.snackBar.open('✅ Ingreso creado exitosamente', 'Cerrar', { duration: 3000 });
          // ✅ Reabrir el modal padre
          // Esto depende de cómo se abre el modal padre originalmente
          this.close.emit();
        }
      });
    }, 500);
  }

  // ✅ MÉTODO PARA FORZAR EL FOCO EN EL MODAL HIJO
  private forceFocusOnModalChild(): void {
    try {
      // Buscar el diálogo hijo
      const dialogContainers = document.querySelectorAll('.cdk-overlay-pane .mat-dialog-container');
      let childDialog = null;
      
      // Buscar el último diálogo (el más reciente)
      if (dialogContainers.length > 0) {
        childDialog = dialogContainers[dialogContainers.length - 1];
      }

      if (!childDialog) {
        console.warn('⚠️ No se encontró el diálogo hijo');
        return;
      }

      // Buscar el contenido del diálogo
      const dialogContent = childDialog.querySelector('.dialog-content');
      if (dialogContent) {
        (dialogContent as HTMLElement).style.pointerEvents = 'auto';
        
        // Buscar el primer input
        const firstInput = dialogContent.querySelector('input:not([type="hidden"]), select, textarea, .mat-input-element');
        if (firstInput) {
          (firstInput as HTMLElement).focus();
          console.log('✅ Foco forzado en el modal hijo:', firstInput);
          
          // Si es un input de Angular Material
          const matInput = firstInput.querySelector('.mat-input-element') as HTMLElement;
          if (matInput) {
            matInput.focus();
          }
        }
      }

      // ✅ Asegurar que todos los inputs del modal hijo reciban eventos
      const allInputs = childDialog.querySelectorAll('input, select, textarea, .mat-form-field');
      allInputs.forEach((el) => {
        (el as HTMLElement).style.pointerEvents = 'auto';
        (el as HTMLElement).style.userSelect = 'auto';
      });

      // ✅ Deshabilitar temporalmente el pointer-events del overlay padre
      const backdrops = document.querySelectorAll('.cdk-overlay-backdrop');
      backdrops.forEach((bd, index) => {
        if (index < backdrops.length - 1) {
          (bd as HTMLElement).style.pointerEvents = 'none';
        }
      });

    } catch (error) {
      console.warn('⚠️ Error al forzar foco en modal hijo:', error);
    }
  }

  clearBatchSelection(): void {
    this.selectedBatch = null;
    this.verifications = [];
    this.snackBar.open('🔄 Filtro de batch eliminado', 'Cerrar', { duration: 2000 });
  }

  get totalParts(): number {
    return this.verifications.length;
  }

  get buenaCount(): number {
    return this.verifications.filter(v => v.status === 'BUENA').length;
  }

  get malaCount(): number {
    return this.verifications.filter(v => v.status === 'MALA').length;
  }

  refresh(): void {
    this.loadBatchesByDevice();
  }
}