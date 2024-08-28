import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportwassapincomesComponent } from './reportwassapincomes.component';

describe('ReportwassapincomesComponent', () => {
  let component: ReportwassapincomesComponent;
  let fixture: ComponentFixture<ReportwassapincomesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportwassapincomesComponent]
    });
    fixture = TestBed.createComponent(ReportwassapincomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
