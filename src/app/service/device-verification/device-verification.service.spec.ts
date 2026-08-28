import { TestBed } from '@angular/core/testing';

import { DeviceVerificationService } from './device-verification.service';

describe('DeviceVerificationService', () => {
  let service: DeviceVerificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceVerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
