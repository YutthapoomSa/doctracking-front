/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KeyboardService } from './keyboard.service';

describe('Service: Keyboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyboardService]
    });
  });

  it('should ...', inject([KeyboardService], (service: KeyboardService) => {
    expect(service).toBeTruthy();
  }));
});
