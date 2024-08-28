import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdititemsComponent } from './edititems.component';

describe('EdititemsComponent', () => {
  let component: EdititemsComponent;
  let fixture: ComponentFixture<EdititemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdititemsComponent]
    });
    fixture = TestBed.createComponent(EdititemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
