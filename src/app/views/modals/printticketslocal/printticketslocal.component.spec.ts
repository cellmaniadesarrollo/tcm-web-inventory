import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintticketslocalComponent } from './printticketslocal.component';

describe('PrintticketslocalComponent', () => {
  let component: PrintticketslocalComponent;
  let fixture: ComponentFixture<PrintticketslocalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintticketslocalComponent]
    });
    fixture = TestBed.createComponent(PrintticketslocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
