import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let fixture: ComponentFixture<Navbar>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
  });

  it('enthält einen Link "Alle Module" auf /module', () => {
    const link = (fixture.nativeElement as HTMLElement).querySelector('a')!;
    expect(link.textContent).toContain('Alle Module');
    expect(link.getAttribute('href')).toBe('/module');
  });
});