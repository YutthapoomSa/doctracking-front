import { TestBed } from '@angular/core/testing';

import { ApiAgencyService } from './api-agency.service';

describe('ApiAgencyService', () => {
  let service: ApiAgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAgencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
