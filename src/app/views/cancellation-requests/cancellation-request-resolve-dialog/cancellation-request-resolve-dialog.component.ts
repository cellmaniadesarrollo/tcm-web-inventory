import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
@Component({
  selector: 'app-cancellation-request-resolve-dialog',
  templateUrl: './cancellation-request-resolve-dialog.component.html',
  styleUrls: ['./cancellation-request-resolve-dialog.component.css']
})
export class CancellationRequestResolveDialogComponent {
  @Input() row: any;
  @Input() action: 'accept' | 'reject' = 'accept';
  @Output() closeModalEvent = new EventEmitter<{ resolved?: boolean }>();

  displayDialog = true;

  observaciones = new FormControl('');
  submitting = false;
  errorMessage: string | null = null;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    if (this.action === 'reject') {
      this.observaciones.setValidators([Validators.required]);
      this.observaciones.updateValueAndValidity();
    }
  }

  get isAccept(): boolean {
    return this.action === 'accept';
  }

  closeModal(result: { resolved?: boolean } = {}): void {
    this.displayDialog = false;
    this.closeModalEvent.emit(result);
  }

  async confirm(): Promise<void> {
    if (this.observaciones.invalid) {
      this.observaciones.markAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    try {
      const body = {
        action: this.action,
        observaciones: this.observaciones.value,
        fecha: new Date(),
      };

      const res = await this.api.cancellationRequestResolve(this.row.requestId, body);
      if (!res.ok) { this.errorMessage = res.message; return; }

      this.closeModal({ resolved: true });
    } catch (err: any) {
      this.errorMessage = err?.message || 'Ocurrió un error al procesar la solicitud';
    } finally {
      this.submitting = false;
    }
  }
}
