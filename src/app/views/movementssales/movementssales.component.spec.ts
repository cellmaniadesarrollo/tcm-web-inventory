import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementssalesComponent } from './movementssales.component';

describe('MovementssalesComponent', () => {
  let component: MovementssalesComponent;
  let fixture: ComponentFixture<MovementssalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovementssalesComponent]
    });
    fixture = TestBed.createComponent(MovementssalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
