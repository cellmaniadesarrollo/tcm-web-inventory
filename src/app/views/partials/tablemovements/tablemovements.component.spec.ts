import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablemovementsComponent } from './tablemovements.component';

describe('TablemovementsComponent', () => {
  let component: TablemovementsComponent;
  let fixture: ComponentFixture<TablemovementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablemovementsComponent]
    });
    fixture = TestBed.createComponent(TablemovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
