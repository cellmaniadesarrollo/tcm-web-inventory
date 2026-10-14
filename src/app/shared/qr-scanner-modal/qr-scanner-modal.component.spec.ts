import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrScannerModalComponent } from './qr-scanner-modal.component';

describe('QrScannerModalComponent', () => {
  let component: QrScannerModalComponent;
  let fixture: ComponentFixture<QrScannerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrScannerModalComponent]
    });
    fixture = TestBed.createComponent(QrScannerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
