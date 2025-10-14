import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepotsAllComponent } from './repots-all.component';

describe('RepotsAllComponent', () => {
  let component: RepotsAllComponent;
  let fixture: ComponentFixture<RepotsAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepotsAllComponent]
    });
    fixture = TestBed.createComponent(RepotsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
