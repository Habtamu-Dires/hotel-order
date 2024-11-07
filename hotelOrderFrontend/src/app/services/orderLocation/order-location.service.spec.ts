import { TestBed } from '@angular/core/testing';

import { OrderLocationService } from './order-location.service';

describe('OrderLocationService', () => {
  let service: OrderLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
