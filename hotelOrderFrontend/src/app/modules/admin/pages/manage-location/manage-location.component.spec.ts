import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLocationComponent } from './manage-location.component';

describe('ManageLocationComponent', () => {
  let component: ManageLocationComponent;
  let fixture: ComponentFixture<ManageLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
