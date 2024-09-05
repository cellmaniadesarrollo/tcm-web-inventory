import { TestBed } from '@angular/core/testing';

import { SocketnotiService } from './socketnoti.service';

describe('SocketnotiService', () => {
  let service: SocketnotiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketnotiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
