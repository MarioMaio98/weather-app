import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
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

  onEnter(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement?.value ?? '';
  
    if (typeof inputValue === 'string') {
      this._weatherService.getCitySuggestion(inputValue).subscribe(cities => {
        const matchingCity = cities.find(
          city => city.name.toLowerCase() === inputValue.toLowerCase()
        );
        console.log(matchingCity)
        if (matchingCity) {
          this.city = matchingCity.name;
          this.country = matchingCity.country;

        } else {
          // gestisce i casi in cui la città non è nella lista
          this.city = inputValue;
          this.country = ''; 
          (err: any) => console.error(err)
        }
  
        this.displayWeather();
      });
    }
  }
  displayWeather(): void {
    if (this.city && this.country) {
      this._weatherService.getWeather(this.city, this.country).subscribe((
        data => {
          this.weather = data
        }
      ),
    (err) => {console.log(err)});
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