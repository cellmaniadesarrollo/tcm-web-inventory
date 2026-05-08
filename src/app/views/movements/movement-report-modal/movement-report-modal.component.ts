import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-movement-report-modal',
  templateUrl: './movement-report-modal.component.html',
})
export class MovementReportModalComponent {
  @Input() fechainit = '';
  @Input() fechafin = '';

  @Output() fechainitChange = new EventEmitter<string>();
  @Output() fechafinChange = new EventEmitter<string>();
  @Output() generate = new EventEmitter<void>();
}