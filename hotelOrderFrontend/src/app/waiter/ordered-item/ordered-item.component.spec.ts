import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedItemComponent } from './ordered-item.component';

describe('OrderedItemComponent', () => {
  let component: OrderedItemComponent;
  let fixture: ComponentFixture<OrderedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderedItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
