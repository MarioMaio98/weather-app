import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  city: any = '';
  country: any = '';
  weather: any = null;

  constructor(private _weatherService: WeatherService) {}

  ngOnInit(): void {}

  getDate(str: string) {
    return str.split(' ')[0];
  }

  getTime(str: string) {
    return str.split(' ')[1];
  }


  displayWeather() {
    console.log('Fetching weather...');
    this._weatherService
      .getWeather(this.city, this.country)
      .subscribe(
        (data) => {
          console.log('Weather data:', data);
          this.weather = data;
        },
        (err) => console.log('Error:', err)
      );
  }
}