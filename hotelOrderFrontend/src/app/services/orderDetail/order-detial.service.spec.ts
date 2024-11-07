import { TestBed } from '@angular/core/testing';

import { OrderDetialService } from './order-detial.service';

describe('OrderDetialService', () => {
  let service: OrderDetialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderDetialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
