// imprimir-modal.component.ts

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ImprimirData {
  id: string;
  nombre: string;
  sku: string;
  stock: number;
  tipo: 'normal' | 'dymo';
}

export interface ImprimirResult {
  cantidad: number;
  tipo: string;
}

@Component({
  selector: 'app-imprimir-modal',
  // ❌ ELIMINAR ESTA LÍNEA
  // standalone: true,
  templateUrl: './imprimir-modal.component.html',
  styleUrls: ['./imprimir-modal.component.css']
})
export class ImprimirModalComponent {
  cantidad: number = 1;
  tipoImpresion: string = 'normal';

  constructor(
    public dialogRef: MatDialogRef<ImprimirModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImprimirData
  ) {
    if (data.tipo) {
      this.tipoImpresion = data.tipo;
    }
  }

  setCantidadRapida(cantidad: number): void {
    const max = this.data.stock || 1;
    this.cantidad = Math.min(cantidad, max);
  }

  onCantidadKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);
    const max = this.data.stock || 1;
    
    if (event.key === 'Enter') {
      if (value < 1) {
        this.cantidad = 1;
      } else if (value > max) {
        this.cantidad = max;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.cantidad < 1 || this.cantidad > (this.data.stock || 1)) {
      return;
    }
    
    const result: ImprimirResult = {
      cantidad: this.cantidad,
      tipo: this.tipoImpresion
    };
    
    this.dialogRef.close(result);
  }

  get maxStock(): number {
    return this.data.stock || 1;
  }

  get isCantidadValida(): boolean {
    return this.cantidad >= 1 && this.cantidad <= this.maxStock;
  }
}