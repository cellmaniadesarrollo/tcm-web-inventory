import { TestBed } from '@angular/core/testing';

import { DymoserviceService } from './dymoservice.service';

describe('DymoserviceService', () => {
  let service: DymoserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DymoserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
