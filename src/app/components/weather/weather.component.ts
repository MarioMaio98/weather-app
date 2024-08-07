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
  cityCtrl = new FormControl<string | City>(''); // Modificato il tipo di FormControl
  filteredCities: Observable<City[]> = new Observable<City[]>(); // Inizializzato come Observable
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
    this.cityCtrl.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.filteredCities = this._weatherService.getCitySuggestion(value);
      }
    });

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
    if (!city  || !city.country || !city.name) {
      return ''
    }
    else{return city ? `${city.name}, ${city.country}`: '';}
    
  }

  onCitySelected(event: MatAutocompleteSelectedEvent): void { //Questa funzione serve per accettare la città suggerita da displayFn
    const selectedCity = event.option.value as City;
    this.cityCtrl.setValue(selectedCity.name); // Modificato per impostare il nome della città
    this.city = selectedCity.name; // Aggiorna la variabile locale city
    this.country = selectedCity.country; // Aggiorna la variabile locale country
  }
}