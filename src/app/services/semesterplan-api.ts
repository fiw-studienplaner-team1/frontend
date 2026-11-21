import { HttpClient } from "@angular/common/http";
import { Injectable, Inject, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Semesterplan } from "../models/semesterplan";
import { Modul } from "../models/modul";
import { Enrollment } from "../models/semesterplan";



@Injectable({ providedIn: 'root' })
export class SemesterplanApi {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080';

    getSemesterplan(): Observable<Semesterplan[]> {
        return this.http.get<Semesterplan[]>(`${this.baseUrl}/semesterplans`);
    }

    getModules(): Observable<Modul[]> {
        return this.http.get<Modul[]>(`${this.baseUrl}/modules`);
    }

    addEnrollModule(planId: number, moduleId: string): Observable<Enrollment> {
        return this.http.post<Enrollment>(`${this.baseUrl}/semesterplans/${planId}/enrollments`, { moduleId });
    }
}
