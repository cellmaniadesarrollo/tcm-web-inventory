import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorysalesnewComponent } from './inventorysalesnew.component';

describe('InventorysalesnewComponent', () => {
  let component: InventorysalesnewComponent;
  let fixture: ComponentFixture<InventorysalesnewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventorysalesnewComponent]
    });
    fixture = TestBed.createComponent(InventorysalesnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
