import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EnrollButton } from './enroll-button';
import { Module } from '../models/module';
import { Semesterplan } from '../models/semesterplan';

const testModul: Module = {
  id: 1,
  name: 'Programmierung 1',
  moduleNumber: 'B11',
  recommendedSemester: 1,
  ects: 6,
  weeklyHours: 6,
  moduleType: 'PFLICHT',
  cycle: 'WISE',
  moduleForm: 'SL',
};

const testPlan = { id: 7, semesterLabel: 'WiSe 2026/27', modules: [] } as unknown as Semesterplan;

describe('EnrollButton', () => {
  let fixture: ComponentFixture<EnrollButton>;
  let httpMock: HttpTestingController;

  const button = () => (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnrollButton],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(EnrollButton);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('module', testModul);
    fixture.componentRef.setInput('semesterplans', [testPlan]);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('wird erstellt', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('ist deaktiviert, wenn es keine Semesterpläne gibt', () => {
    fixture.componentRef.setInput('semesterplans', []);
    fixture.detectChanges();

    expect(button().disabled).toBe(true);
  });

  it('ist aktiv, wenn es Semesterpläne gibt', () => {
    expect(button().disabled).toBe(false);
  });

  it('plant das Modul im gewählten Semester ein und sagt der Seite Bescheid', () => {
    let bescheidBekommen = false;
    fixture.componentInstance.enrolled.subscribe(() => (bescheidBekommen = true));

    fixture.componentInstance.addModule(testModul, testPlan);

    const anfrage = httpMock.expectOne('http://localhost:8080/semesterplans/7/enrollments');
    expect(anfrage.request.method).toBe('POST');
    expect(anfrage.request.body).toEqual({ moduleId: 1 });
    anfrage.flush({});

    expect(bescheidBekommen).toBe(true);
  });

  it('sagt der Seite nicht Bescheid, wenn das Einplanen fehlschlägt', () => {
    let bescheidBekommen = false;
    fixture.componentInstance.enrolled.subscribe(() => (bescheidBekommen = true));

    fixture.componentInstance.addModule(testModul, testPlan);
    httpMock
      .expectOne('http://localhost:8080/semesterplans/7/enrollments')
      .flush('Fehler', { status: 500, statusText: 'Server Error' });

    expect(bescheidBekommen).toBe(false);
  });
});