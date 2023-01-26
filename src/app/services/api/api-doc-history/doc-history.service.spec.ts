import { TestBed } from '@angular/core/testing';

import { DocHistoryService } from './doc-history.service';

describe('DocHistoryService', () => {
  let service: DocHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
