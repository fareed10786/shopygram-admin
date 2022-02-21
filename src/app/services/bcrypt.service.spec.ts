import { TestBed } from '@angular/core/testing';

import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcryptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
