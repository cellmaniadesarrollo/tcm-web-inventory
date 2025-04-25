import { TestBed } from '@angular/core/testing';

import { UbicacionCompartidaService } from './ubicacion-compartida.service';

describe('UbicacionCompartidaService', () => {
  let service: UbicacionCompartidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UbicacionCompartidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
