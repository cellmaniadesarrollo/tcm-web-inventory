import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesguaceComponent } from './desguace.component';

describe('DesguaceComponent', () => {
  let component: DesguaceComponent;
  let fixture: ComponentFixture<DesguaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesguaceComponent]
    });
    fixture = TestBed.createComponent(DesguaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
