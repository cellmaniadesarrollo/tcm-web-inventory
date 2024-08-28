import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporpricespdfincomesComponent } from './reporpricespdfincomes.component';

describe('ReporpricespdfincomesComponent', () => {
  let component: ReporpricespdfincomesComponent;
  let fixture: ComponentFixture<ReporpricespdfincomesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporpricespdfincomesComponent]
    });
    fixture = TestBed.createComponent(ReporpricespdfincomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
