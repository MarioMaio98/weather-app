import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { Router } from '@angular/router';
import { Routes } from '@angular/router';

const routes: Routes = [
  // Definisci le tue route qui
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    // Altri provider e moduli necessari
  ]
})
.catch((err: any) => console.error(err));