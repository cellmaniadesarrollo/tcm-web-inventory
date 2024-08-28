import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatebrandComponent } from './createbrand.component';

describe('CreatebrandComponent', () => {
  let component: CreatebrandComponent;
  let fixture: ComponentFixture<CreatebrandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatebrandComponent]
    });
    fixture = TestBed.createComponent(CreatebrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
