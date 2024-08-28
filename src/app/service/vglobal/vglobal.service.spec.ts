import { TestBed } from '@angular/core/testing';

import { VglobalService } from './vglobal.service';

describe('VglobalService', () => {
  let service: VglobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VglobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
