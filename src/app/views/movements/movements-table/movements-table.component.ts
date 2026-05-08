import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MovementsI } from 'src/app/models/movements.interface';

@Component({
  selector: 'app-movements-table',
  templateUrl: './movements-table.component.html',
})
export class MovementsTableComponent {
  @Input() movements: MovementsI[] = [];
  @Input() loading = true;
  @Input() datapage: any;
  @Input() totalItems: any;

  @Output() rowClick = new EventEmitter<string>();

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