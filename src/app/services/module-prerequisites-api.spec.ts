import { TestBed } from '@angular/core/testing';
import { ModulePrerequisitesApi } from './module-prerequisites-api';

describe('ModulePrerequisites', () => {
  let service: ModulePrerequisitesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModulePrerequisitesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
