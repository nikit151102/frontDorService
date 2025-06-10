import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDocsComponent } from './general-docs.component';

describe('GeneralDocsComponent', () => {
  let component: GeneralDocsComponent;
  let fixture: ComponentFixture<GeneralDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
