import { TestBed } from '@angular/core/testing';

import { OrderedItemService } from './ordered-item.service';

describe('OrderedItemService', () => {
  let service: OrderedItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderedItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
