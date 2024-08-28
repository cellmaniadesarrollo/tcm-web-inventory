import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsperComponent } from './movementsper.component';

describe('MovementsperComponent', () => {
  let component: MovementsperComponent;
  let fixture: ComponentFixture<MovementsperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovementsperComponent]
    });
    fixture = TestBed.createComponent(MovementsperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
