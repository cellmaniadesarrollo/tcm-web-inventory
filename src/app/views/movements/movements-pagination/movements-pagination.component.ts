import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-movements-pagination',
  templateUrl: './movements-pagination.component.html',
})
export class MovementsPaginationComponent {
  @Input() datapage: any;
  @Input() currentCount = 0;
  @Input() totalentries: any;
  @Input() numperpagess: any[] = [];
  @Input() numperpagesForm!: FormGroup;

  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<void>();
}