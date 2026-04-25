import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // <-- NEU
import { AuthService } from '../../core/services/auth.service'; // <-- NEU (Passe den Pfad ggf. an!)

@Component({
  selector: 'app-merge-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './merge-accounts.html',
  styleUrl: './merge-accounts.css'
})
export class MergeAccounts implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  // Diese beiden Injects haben gefehlt:
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  email: string = '';
  discordId: string = '';

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.discordId = this.route.snapshot.queryParamMap.get('discordId') || '';
  }

  // NEU: Logik fürs Zusammenführen
  onMerge() {
    const data = {
      email: this.email, // Die E-Mail des alten Accounts
      discordId: this.discordId,
      discordName: this.route.snapshot.queryParamMap.get('name'), 
      avatarId: this.route.snapshot.queryParamMap.get('avatar')
    };

    this.http.post<{token: string}>('http://localhost:3000/api/auth/confirm-merge', data)
      .subscribe(response => {
        this.authService.setSession(response.token);
        this.router.navigate(['/home']);
      });
  }

  // Logik für getrennte Accounts
  onNoMerge() {
    const data = {
      discordId: this.discordId,
      discord_email: this.email, 
      discordName: this.route.snapshot.queryParamMap.get('name'), 
      avatarId: this.route.snapshot.queryParamMap.get('avatar')
    };

    this.http.post<{token: string}>('http://localhost:3000/api/auth/confirm-separate-account', data)
      .subscribe(response => {
        this.authService.setSession(response.token);
        this.router.navigate(['/home']);
      });
  }
}