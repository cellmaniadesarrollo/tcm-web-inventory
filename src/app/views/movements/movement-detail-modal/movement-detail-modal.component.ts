import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MovementnameI, MovementsI, TechnicianeMoveI } from 'src/app/models/movements.interface';

@Component({
  selector: 'app-movement-detail-modal',
  templateUrl: './movement-detail-modal.component.html',
})
export class MovementDetailModalComponent {
  @ViewChild('closebutton') closebutton: any;

  @Input() active = 1;
  @Input() devoluciones = false;
  @Input() salida = false;
  @Input() detalles = false;
  @Input() editar = false;
  @Input() devolucionForm!: FormGroup;
  @Input() editmovementForm!: FormGroup;
  @Input() detailsdata: MovementsI = {};
  @Input() ins: MovementnameI[] = [];
  @Input() technicians: TechnicianeMoveI[] = [];
  @Input() submittedoutmovement = false;
  @Input() minvalue: String = '1';
  @Input() maxvalue: String = '';

  @Output() activeChange = new EventEmitter<number>();
  @Output() saveReturn = new EventEmitter<void>();
  @Output() saveEdit = new EventEmitter<void>();
  @Output() tabSalida = new EventEmitter<void>();
  @Output() tabDetalles = new EventEmitter<void>();
  @Output() tabEditar = new EventEmitter<void>();

  get f(): { [key: string]: AbstractControl } {
    return this.devolucionForm.controls;
  }

  // El padre llama este método vía @ViewChild después de guardar exitosamente
  close() {
    this.closebutton.nativeElement.click();
  }

  datacolor(data: any) {
    const map: any = {
      'DAÑADO': 'table-danger', 'REPARACION': 'table-primary',
      'INCOMPATIVILIDAD': 'table-warning', 'VENTA': 'table-success',
      'NO REQUERIDO': 'table-secondary', 'RECICLAJE': 'table-info',
      'DAÑO ACCIDENTE': 'table-dark',
    };
    return map[data] ?? 'table-light';
  }
}