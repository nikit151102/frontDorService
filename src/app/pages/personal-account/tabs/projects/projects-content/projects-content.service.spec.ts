import { TestBed } from '@angular/core/testing';
import { ProjectsContentService } from './projects-content.service';

describe('ProjectsContentService', () => {
  let service: ProjectsContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
