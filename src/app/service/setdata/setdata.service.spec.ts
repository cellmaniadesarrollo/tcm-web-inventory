import { TestBed } from '@angular/core/testing';

import { SetdataService } from './setdata.service';

describe('SetdataService', () => {
  let service: SetdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
