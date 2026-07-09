import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationRequestResolveDialogComponent } from './cancellation-request-resolve-dialog.component';

describe('CancellationRequestResolveDialogComponent', () => {
  let component: CancellationRequestResolveDialogComponent;
  let fixture: ComponentFixture<CancellationRequestResolveDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancellationRequestResolveDialogComponent]
    });
    fixture = TestBed.createComponent(CancellationRequestResolveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
