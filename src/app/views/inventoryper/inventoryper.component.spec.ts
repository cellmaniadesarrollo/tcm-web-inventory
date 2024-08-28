import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryperComponent } from './inventoryper.component';

describe('InventoryperComponent', () => {
  let component: InventoryperComponent;
  let fixture: ComponentFixture<InventoryperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryperComponent]
    });
    fixture = TestBed.createComponent(InventoryperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
