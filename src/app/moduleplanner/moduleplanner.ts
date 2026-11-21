import { Component, signal, OnInit, Inject, inject} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SemesterplanApi } from '../services/semesterplan-api';
import { Semesterplan } from '../models/semesterplan';

@Component({
  imports: [MatCardModule, MatButtonModule, MatListModule, MatInputModule, MatFormFieldModule],
  selector: 'app-modulplaner',
  styleUrl: './moduleplanner.css',
  templateUrl: './moduleplanner.html',
})
export class Moduleplanner implements OnInit{
private api = inject(SemesterplanApi);

semesterplan = signal<Semesterplan[]>([]);
status = signal<string>('laden');

getTotalEcts(plan:Semesterplan): number {
  return plan.modules.reduce((sum, module) => sum + module.ects, 0);
}

  ngOnInit(): void {
    this.api.getSemesterplan().subscribe ({
      next: (data) => {
        this.semesterplan.set(data);
        this.status.set('ok');
      },
      error: ()=> this.status.set('fehler')
    });
  }
}