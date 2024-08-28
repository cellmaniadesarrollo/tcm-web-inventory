import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecolorComponent } from './createcolor.component';

describe('CreatecolorComponent', () => {
  let component: CreatecolorComponent;
  let fixture: ComponentFixture<CreatecolorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatecolorComponent]
    });
    fixture = TestBed.createComponent(CreatecolorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
