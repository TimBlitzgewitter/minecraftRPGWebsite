import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: '../auth.css' 
})
export class Login {
  
  loginWithDiscord() {
    window.location.href = 'http://localhost:3000/api/auth/discord';
  }
}