import { TestBed } from '@angular/core/testing';

import { UsersRegisterService } from './users-register.service';

describe('UsersRegisterService', () => {
  let service: UsersRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
