import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router'; // TODO: NAVBAR: nur noetig wegen routerLink in der Navbar
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])], // TODO: NAVBAR: nur noetig wegen routerLink in der Navbar
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  //TODO NAVBAR: ganzen Test loeschen oder anpassen, wenn die Navbar nicht mehr in App eingebunden ist
  it('should render the navbar', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-navbar')).toBeTruthy();
  });
});