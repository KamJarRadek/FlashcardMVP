import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import {NoopAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {provideZoneChangeDetection} from "@angular/core";

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    NoopAnimationsModule
  ]
}).catch(err => console.error(err));
