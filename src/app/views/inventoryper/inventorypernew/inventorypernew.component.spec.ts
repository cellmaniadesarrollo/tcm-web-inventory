import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorypernewComponent } from './inventorypernew.component';

describe('InventorypernewComponent', () => {
  let component: InventorypernewComponent;
  let fixture: ComponentFixture<InventorypernewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventorypernewComponent]
    });
    fixture = TestBed.createComponent(InventorypernewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
