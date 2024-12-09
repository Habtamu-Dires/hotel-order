import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllFreqComponent } from './view-all-freq.component';

describe('ViewAllFreqComponent', () => {
  let component: ViewAllFreqComponent;
  let fixture: ComponentFixture<ViewAllFreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllFreqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllFreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
