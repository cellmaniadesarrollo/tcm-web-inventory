import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorysalesComponent } from './inventorysales.component';

describe('InventorysalesComponent', () => {
  let component: InventorysalesComponent;
  let fixture: ComponentFixture<InventorysalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventorysalesComponent]
    });
    fixture = TestBed.createComponent(InventorysalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
