import { TestBed } from '@angular/core/testing';

import { InventoryTransfersApiService } from './inventory-transfers-api.service';

describe('InventoryTransfersApiService', () => {
  let service: InventoryTransfersApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryTransfersApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
