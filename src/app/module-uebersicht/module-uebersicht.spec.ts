import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleUebersicht } from './module-uebersicht';

describe('ModuleUebersicht', () => {
  let component: ModuleUebersicht;
  let fixture: ComponentFixture<ModuleUebersicht>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleUebersicht],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleUebersicht);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
