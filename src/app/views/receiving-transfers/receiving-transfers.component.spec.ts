import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingTransfersComponent } from './receiving-transfers.component';

describe('ReceivingTransfersComponent', () => {
  let component: ReceivingTransfersComponent;
  let fixture: ComponentFixture<ReceivingTransfersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivingTransfersComponent]
    });
    fixture = TestBed.createComponent(ReceivingTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
