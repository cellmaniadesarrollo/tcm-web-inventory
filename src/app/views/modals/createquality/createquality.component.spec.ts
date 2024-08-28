import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatequalityComponent } from './createquality.component';

describe('CreatequalityComponent', () => {
  let component: CreatequalityComponent;
  let fixture: ComponentFixture<CreatequalityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatequalityComponent]
    });
    fixture = TestBed.createComponent(CreatequalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
