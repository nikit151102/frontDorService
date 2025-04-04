import { TestBed } from '@angular/core/testing';
import { ProjectsService } from './projects.service';


describe('PartnersService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
