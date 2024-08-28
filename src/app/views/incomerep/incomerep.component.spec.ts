import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomerepComponent } from './incomerep.component';

describe('IncomerepComponent', () => {
  let component: IncomerepComponent;
  let fixture: ComponentFixture<IncomerepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomerepComponent]
    });
    fixture = TestBed.createComponent(IncomerepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
