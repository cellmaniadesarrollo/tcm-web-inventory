import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatenameitemsComponent } from './createnameitems.component';

describe('CreatenameitemsComponent', () => {
  let component: CreatenameitemsComponent;
  let fixture: ComponentFixture<CreatenameitemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatenameitemsComponent]
    });
    fixture = TestBed.createComponent(CreatenameitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
