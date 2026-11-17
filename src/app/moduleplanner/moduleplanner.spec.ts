import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Moduleplanner } from './moduleplanner';

describe('Modulplanner', () => {
  let component: Moduleplanner;
  let fixture: ComponentFixture<Moduleplanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moduleplanner],
    }).compileComponents();

    fixture = TestBed.createComponent(Moduleplanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
