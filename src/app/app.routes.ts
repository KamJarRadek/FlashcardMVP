import { Routes } from '@angular/router';
import {ProposalListComponent} from "./components/proposal-list/proposal-list.component";

export const routes: Routes = [
  { path: 'flashcards', component: ProposalListComponent },
  { path: '', component: ProposalListComponent },
  { path: '**', redirectTo: '' }
];
