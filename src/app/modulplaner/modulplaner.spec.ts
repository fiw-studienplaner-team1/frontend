import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modulplaner } from './modulplaner';

describe('Modulplaner', () => {
  let component: Modulplaner;
  let fixture: ComponentFixture<Modulplaner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modulplaner],
    }).compileComponents();

    fixture = TestBed.createComponent(Modulplaner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
