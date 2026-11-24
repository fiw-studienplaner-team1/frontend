import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModulePrerequisites } from './module-prerequisites';

describe('ModulePrerequisites', () => {
  let component: ModulePrerequisites;
  let fixture: ComponentFixture<ModulePrerequisites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulePrerequisites],
    }).compileComponents();

    fixture = TestBed.createComponent(ModulePrerequisites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
