import { TestBed } from '@angular/core/testing';

import { ApiDocumentService } from './api-document.service';

describe('ApiDocumentService', () => {
  let service: ApiDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
