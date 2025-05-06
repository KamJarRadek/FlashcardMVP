import {RouterOutlet} from '@angular/router';
import {TextFormComponent} from "./components/text-form/text-form.component";
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {SupabaseService} from './services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterOutlet, TextFormComponent],
  providers: [SupabaseService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private supabaseService: SupabaseService) {
  }

  ngOnInit() {
    // Przykład jak można wykorzystać serwis Supabase
    // Zakładając, że użytkownik jest zalogowany i mamy jego ID

    const userId = '0709491b-c441-4924-bcf5-892a26bb998e';

    this.supabaseService.getFlashcardsByUserId(userId)
      .then(response => {
        if (response.error) {
          console.error('Błąd podczas pobierania fiszek:', response.error);
        } else {
          console.log('Pobrane fiszki:', response.data);
        }
      });

  }

  title = 'flashcard-mvp';
}
