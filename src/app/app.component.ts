import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TextFormComponent} from "./components/text-form/text-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TextFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'flashcard-mvp';
}
