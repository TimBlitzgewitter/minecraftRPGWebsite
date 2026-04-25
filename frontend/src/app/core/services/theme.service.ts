import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Wir starten im Dark Mode (true)
  isDarkMode = signal<boolean>(true);

  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
    
    // Greift auf das rohe HTML-Dokument zu und tauscht die Klasse aus
    if (this.isDarkMode()) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }
}