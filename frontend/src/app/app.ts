import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit { // OnInit implementieren
  public themeService = inject(ThemeService);
  public authService = inject(AuthService); // AuthService injizieren
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    // Hier lauschen wir auf die URL-Parameter
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      
      if (token) {
        console.log('Token in URL gefunden, verarbeite Session...');
        // 1. Token im AuthService & LocalStorage speichern
        this.authService.setSession(token);
        
        // URL säubern
        this.router.navigate([], {
          queryParams: { token: null },
          queryParamsHandling: 'merge'
        });
      }
    });
  }
}