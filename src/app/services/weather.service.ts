import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface City {
  name: string;
  country: string;
}

@Injectable({ 
  providedIn: 'root', 
}) 
export class WeatherService {
  private readonly apiKey: string = 'your-api-key-here'; 

  constructor(private _http: HttpClient) {} 

  getWeather(city: string, country: string) { 
    const apiUrl = 
    `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${this.apiKey}`; 
    return this._http.get(apiUrl); 
  } 

  getCitySuggestion(query: string): Observable<City[]> {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`;
    return this._http.get<any[]>(url).pipe(
      map(response => response.map(city => ({ //map the response, taking name and country from the json response
        name: city.name,
        country: city.country
      })))
    );
  }
}