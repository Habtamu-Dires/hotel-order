import { TestBed } from '@angular/core/testing';

import { CashierService } from './cashier.service';

describe('CashierService', () => {
  let service: CashierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
