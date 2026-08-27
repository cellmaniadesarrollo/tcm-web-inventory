// components/desguace/desguace.component.ts

import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/service/api/api.service';
import { DeviceVerificationService } from 'src/app/service/device-verification/device-verification.service';

@Component({
  selector: 'app-desguace',
  templateUrl: './desguace.component.html',
  styleUrls: ['./desguace.component.css']
})
export class DesguaceComponent implements OnInit, OnDestroy {

  @Input() deviceId: string = '';
  @Output() close = new EventEmitter<void>();

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
  ) {}

  ngOnInit(): void {
    if (this.deviceId) {
      this.loadBatchesByDevice();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ CARGAR BATCHES USANDO ApiService (movementoutdata)
  async loadBatchesByDevice(): Promise<void> {
    if (!this.deviceId) return;

    this.isBatchLoading = true;
    try {
      const response = await this.api.movementoutdata(this.deviceId);
      console.log('📦 RESPONSE COMPLETO DE movementoutdata:', JSON.stringify(response, null, 2));
      
      if (response && response.batches) {
        this.batches = response.batches.map((batch: any) => ({
          ...batch,
          realId: batch.batchId || batch._id,
          displayName: `Lote ${batch.batchNumber} - ${batch.batchSku || batch.sku || 'N/A'}`
        }));
        console.log('📦 Batches cargados:', this.batches);
        
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

  // ✅ SELECCIONAR BATCH Y CONSULTAR PARTES
  onBatchSelected(batch: any): void {
    if (!batch) {
      this.selectedBatch = null;
      this.verifications = [];
      return;
    }

    // ✅ USAR EL realId (batchId) QUE ES EL _id REAL EN LA BD
    const batchRealId = batch.realId || batch.batchId || batch._id;
    
    if (!batchRealId) {
      console.error('❌ No se encontró el ID real del batch:', batch);
      this.snackBar.open('❌ Error: ID de batch no válido', 'Cerrar', { duration: 3000 });
      return;
    }

    this.selectedBatch = batch;
    this.isLoading = true;

    console.log('🔍 Buscando batch con ID:', batchRealId);

    // DeviceVerificationService devuelve Observable
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

  // ✅ LIMPIAR SELECCIÓN
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