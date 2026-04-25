import { Routes } from '@angular/router';
import { Leaderboard } from './features/leaderboard/leaderboard.component';
import { Impressum } from './impressum/impressum.component';
import { Login } from './auth/login/login.component';
import { Register } from './auth/register/register.component';
import { Home } from './features/home/home.component';
import { MergeAccounts } from './auth/merge-accounts/merge-accounts.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'leaderboard', component: Leaderboard },
  { path: 'impressum', component: Impressum },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: 'auth/merge-accounts', component: MergeAccounts }
];