import { Routes } from '@angular/router';
import { ProposalListComponent } from "./components/proposal-list/proposal-list.component";
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'flashcards',
    component: ProposalListComponent,
    canActivate: [authGuard],
    title: 'Fiszki'
  },
  {
    path: '',
    component: ProposalListComponent,
    canActivate: [authGuard],
    title: 'Fiszki'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
    title: 'Logowanie'
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [loginGuard],
    title: 'Rejestracja'
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [loginGuard],
    title: 'Zapomniałem hasła'
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [loginGuard],
    title: 'Reset hasła'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
