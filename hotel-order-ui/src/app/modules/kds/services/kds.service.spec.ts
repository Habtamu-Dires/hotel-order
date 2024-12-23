import { TestBed } from '@angular/core/testing';

import { KdsService } from './kds.service';

describe('KdsService', () => {
  let service: KdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
