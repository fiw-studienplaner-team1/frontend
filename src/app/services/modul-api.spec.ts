import { TestBed } from '@angular/core/testing';
import { ModulApi } from './modul-api';

describe('ModulApi', () => {
  let service: ModulApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModulApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
