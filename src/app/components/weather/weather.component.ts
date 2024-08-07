import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

interface City {
  name: string;
  country: string;
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  cityCtrl = new FormControl<City | string>(''); 
  filteredCities: Observable<City[]> = new Observable<City[]>(); 
  city: string = '';
  country: string = '';
  weather: any = null;

  constructor(private _weatherService: WeatherService) {}

  ngOnInit(): void {
    this.filteredCities = this.cityCtrl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this._weatherService.getCitySuggestion(value);
        } else {
          return [];
        }
      })
    );
  }

  getDate(str: string): string {
    return str.split(' ')[0];
  }

  getTime(str: string): string {
    return str.split(' ')[1];
  }

  displayWeather(): void {
    if (this.city && this.country) {
      this._weatherService.getWeather(this.city, this.country).subscribe(
        data => this.weather = data,
        err => console.error(err)
      );
    }
  }

  displayFn(city?: City): string {
    if (!city) {
      return '';
    }
    console.log('displayFn city:', city);
    return `${city.name || 'Unknown city'}, ${city.country || 'Unknown country'}`;
  }

  onCitySelected(event: MatAutocompleteSelectedEvent): void {
    const selectedCity = event.option.value as City;
    console.log('Selected city:', selectedCity);
    this.cityCtrl.setValue(selectedCity);
    this.city = selectedCity.name; 
    this.country = selectedCity.country; 
  }
}