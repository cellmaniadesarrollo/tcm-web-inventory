import { TestBed } from '@angular/core/testing';

import { TokencheckService } from './tokencheck.service';

describe('TokencheckService', () => {
  let service: TokencheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokencheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
