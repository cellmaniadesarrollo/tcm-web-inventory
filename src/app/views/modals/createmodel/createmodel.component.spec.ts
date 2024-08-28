import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemodelComponent } from './createmodel.component';

describe('CreatemodelComponent', () => {
  let component: CreatemodelComponent;
  let fixture: ComponentFixture<CreatemodelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatemodelComponent]
    });
    fixture = TestBed.createComponent(CreatemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
