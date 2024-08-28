import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinttiketsitemsComponent } from './printtiketsitems.component';

describe('PrinttiketsitemsComponent', () => {
  let component: PrinttiketsitemsComponent;
  let fixture: ComponentFixture<PrinttiketsitemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrinttiketsitemsComponent]
    });
    fixture = TestBed.createComponent(PrinttiketsitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
