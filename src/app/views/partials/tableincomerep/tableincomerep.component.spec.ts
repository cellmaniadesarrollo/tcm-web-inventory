import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableincomerepComponent } from './tableincomerep.component';

describe('TableincomerepComponent', () => {
  let component: TableincomerepComponent;
  let fixture: ComponentFixture<TableincomerepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableincomerepComponent]
    });
    fixture = TestBed.createComponent(TableincomerepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
