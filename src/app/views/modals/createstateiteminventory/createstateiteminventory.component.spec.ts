import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatestateiteminventoryComponent } from './createstateiteminventory.component';

describe('CreatestateiteminventoryComponent', () => {
  let component: CreatestateiteminventoryComponent;
  let fixture: ComponentFixture<CreatestateiteminventoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatestateiteminventoryComponent]
    });
    fixture = TestBed.createComponent(CreatestateiteminventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
