import { Component, Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({ 
providedIn: 'root', 
}) 

export class WeatherService {
searchCities(arg0: {}): any {
  throw new Error('Method not implemented.');
} 
private readonly apiKey: string = 'your-api-key'; 

constructor(private _http: HttpClient) {} 

getWeather(city: string, country: string) { 
	const apiUrl = 
`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${this.apiKey}`; 
	return this._http.get(apiUrl); 
} 

getCitySuggestion(query: string): Observable<any>{
	const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`;
    return this._http.get<any[]>(url);
}


}


