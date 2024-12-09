import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyTableComponent } from './frequency-table.component';

describe('FrequencyTableComponent', () => {
  let component: FrequencyTableComponent;
  let fixture: ComponentFixture<FrequencyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrequencyTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrequencyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
