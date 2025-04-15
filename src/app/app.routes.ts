import { Routes } from '@angular/router';
import {FlashcardsPageComponent} from "./components/flashcards-page/flashcards-page.component";

export const routes: Routes = [
  { path: 'flashcards', component: FlashcardsPageComponent },
  { path: '', redirectTo: '/flashcards', pathMatch: 'full' }
];
