import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // 1. Alle Injections (Dienste, die Angular uns bereitstellt)
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  // 2. Unser globaler Status, ob jemand eingeloggt ist
  currentUser = signal<any>(null);

  constructor() {
    // Nur im Browser ausführen, nicht auf dem Server (SSR Schutz)
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('rpg_token');
      if (token) {
        this.currentUser.set(this.decodeToken(token));
      }
    }
  }

  // 3. API-Aufruf an das NestJS-Backend (Option 3: Separater Account)
  createSeparateAccount(details: any) {
    return this.http.post<{token: string}>(
      'http://localhost:3000/api/auth/confirm-separate-account', 
      details
    );
  }

  // Füge hier auch mal einen log in die setSession ein:
  setSession(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('rpg_token', token);
      this.currentUser.set(this.decodeToken(token));
      console.log('💾 Session gespeichert. User ist jetzt:', this.currentUser());
    }
  }

  // 5. Token löschen und User abmelden
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('rpg_token');
      this.currentUser.set(null);
      // Leitet nach dem Logout zurück zur Startseite und lädt sie neu
      window.location.href = '/home';
    }
  }

  // 6. Hilfsfunktion, um die Userdaten aus dem Token zu lesen
  private decodeToken(token: string) {
    try {
      // JWTs sind Base64Url verschlüsselt. Wir müssen Zeichen ersetzen, damit atob() nicht crasht!
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      const payload = JSON.parse(atob(base64));
      console.log('✅ Token erfolgreich entschlüsselt:', payload);
      return payload;
    } catch (e) {
      console.error('❌ Fehler beim Entschlüsseln des Tokens:', e);
      return null;
    }
  }
}