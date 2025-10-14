import { TestBed } from '@angular/core/testing';

import { ReportsCelularesService } from './reports-celulares.service';

describe('ReportsCelularesService', () => {
  let service: ReportsCelularesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsCelularesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
