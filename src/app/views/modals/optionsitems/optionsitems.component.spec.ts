import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsitemsComponent } from './optionsitems.component';

describe('OptionsitemsComponent', () => {
  let component: OptionsitemsComponent;
  let fixture: ComponentFixture<OptionsitemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptionsitemsComponent]
    });
    fixture = TestBed.createComponent(OptionsitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
