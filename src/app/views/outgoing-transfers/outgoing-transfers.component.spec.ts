import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingTransfersComponent } from './outgoing-transfers.component';

describe('OutgoingTransfersComponent', () => {
  let component: OutgoingTransfersComponent;
  let fixture: ComponentFixture<OutgoingTransfersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutgoingTransfersComponent]
    });
    fixture = TestBed.createComponent(OutgoingTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
