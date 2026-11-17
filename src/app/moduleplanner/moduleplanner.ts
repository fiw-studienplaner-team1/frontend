import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  imports: [MatCardModule, MatButtonModule, MatListModule, MatInputModule, MatFormFieldModule],
  selector: 'app-modulplaner',
  styleUrl: './moduleplanner.css',
  templateUrl: './moduleplanner.html',
})
export class Moduleplanner {}