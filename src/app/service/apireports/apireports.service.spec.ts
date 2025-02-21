import { TestBed } from '@angular/core/testing';

import { ApireportsService } from './apireports.service';

describe('ApireportsService', () => {
  let service: ApireportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApireportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
