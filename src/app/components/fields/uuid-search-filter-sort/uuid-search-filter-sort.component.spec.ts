import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UuidSearchFilterSortComponent } from './uuid-search-filter-sort.component';

describe('UuidSearchFilterSortComponent', () => {
  let component: UuidSearchFilterSortComponent;
  let fixture: ComponentFixture<UuidSearchFilterSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UuidSearchFilterSortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UuidSearchFilterSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
