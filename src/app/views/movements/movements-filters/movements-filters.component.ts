import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MovementnameI, MovementtypeI } from 'src/app/models/movements.interface';

@Component({
  selector: 'app-movements-filters',
  templateUrl: './movements-filters.component.html',
})
export class MovementsFiltersComponent {
  @Input() searchForm!: FormGroup;
  @Input() typemovementform!: FormGroup;
  @Input() namemovementform!: FormGroup;
  @Input() blockbusqueda = false;
  @Input() typestypemovements: MovementtypeI[] = [];
  @Input() typesmovements: MovementnameI[] = [];

  @Output() searchKeyUp = new EventEmitter<any>();
  @Output() findClick = new EventEmitter<void>();
  @Output() typeChange = new EventEmitter<void>();
  @Output() nameChange = new EventEmitter<void>();
  @Output() reportClick = new EventEmitter<void>();

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