import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomesalesComponent } from './incomesales.component';

describe('IncomesalesComponent', () => {
  let component: IncomesalesComponent;
  let fixture: ComponentFixture<IncomesalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomesalesComponent]
    });
    fixture = TestBed.createComponent(IncomesalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
