import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorynewComponent } from './inventorynew.component';

describe('InventorynewComponent', () => {
  let component: InventorynewComponent;
  let fixture: ComponentFixture<InventorynewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventorynewComponent]
    });
    fixture = TestBed.createComponent(InventorynewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
