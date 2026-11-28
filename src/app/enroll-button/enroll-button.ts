import { Component, inject, input, output } from '@angular/core';
import { SemesterplanApi } from '../services/semesterplan-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Module } from '../models/module';
import { Semesterplan } from '../models/semesterplan';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  imports: [MatButtonModule, MatMenuModule],
  selector: 'app-enroll-button',
  styleUrl: './enroll-button.css',
  templateUrl: './enroll-button.html',
})
export class EnrollButton {
  private api = inject(SemesterplanApi);
  private snackBar = inject(MatSnackBar);

  module = input.required<Module>();
  semesterplans = input.required<Semesterplan[]>();
  enrolled = output<void>();

  addModule(module: Module, plan: Semesterplan): void {
    this.api.addEnrollModule(plan.id, module.id).subscribe ({
      next: () => {
        this.snackBar.open(`${module.id} wurde in ${plan.semesterLabel} eingeplant.`, 'OK', {
         duration: 3000,
        });
        this.enrolled.emit();
      },
      error: (err: HttpErrorResponse) => this.showError(err, 'Modul konnte nicht eingeplant werden.'),
    });
  }

  private showError(err: HttpErrorResponse, fallback: string): void {
    const message = err.error?.message ?? fallback;
    this.snackBar.open(message, 'Schließen', { duration: 5000 });
  }

}
