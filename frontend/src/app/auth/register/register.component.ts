import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: '../auth.css' 
})
export class Register {
  
  loginWithDiscord() {
    window.location.href = 'http://localhost:3000/api/auth/discord';
  }
}