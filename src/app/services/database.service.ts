import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export interface FlashcardAction {
  definition: string;
  concept: string;
  action: 'accepted' | 'rejected';
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private supabase = createClient(environment.supabaseUrl!, environment.supabaseKey!);

  saveFlashcardAction(data: FlashcardAction): Observable<any> {
    // Wstaw rekord do tabeli "flashcard_actions" w Supabase
    const insertPromise = this.supabase
      .from('flashcard_actions')
      .insert([data]);
    return from(insertPromise);
  }
}
