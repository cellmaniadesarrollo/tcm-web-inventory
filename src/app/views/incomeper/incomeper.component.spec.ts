import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeperComponent } from './incomeper.component';

describe('IncomeperComponent', () => {
  let component: IncomeperComponent;
  let fixture: ComponentFixture<IncomeperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeperComponent]
    });
    fixture = TestBed.createComponent(IncomeperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
