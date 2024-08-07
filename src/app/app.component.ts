import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


import { WeatherComponent } from './components/weather/weather.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,

    WeatherComponent,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
  

  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'my-weather';
}