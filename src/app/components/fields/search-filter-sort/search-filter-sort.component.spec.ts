import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterSortComponent } from './search-filter-sort.component';

describe('SearchFilterSortComponent', () => {
  let component: SearchFilterSortComponent;
  let fixture: ComponentFixture<SearchFilterSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFilterSortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFilterSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
