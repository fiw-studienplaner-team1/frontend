import { HttpClient } from "@angular/common/http";
import { Injectable, Inject, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Semesterplan } from "../models/semesterplan";



@Injectable({ providedIn: 'root' })
export class SemesterplanApi {
    private http = inject(HttpClient);
    private url = 'http://localhost:8080/semesterplans';

    getSemesterplan(): Observable<Semesterplan[]> {
        return this.http.get<Semesterplan[]>(this.url);
    }
}