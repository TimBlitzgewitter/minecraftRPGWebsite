import { Component, signal, inject, OnInit } from '@angular/core'; // <-- Hier war der Fehler!
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Wir definieren ein Interface, damit TypeScript weiß, welche Felder existieren
export interface PlayerStats {
  uuid: string;
  level: number;
  exp: number;
  class: string;
  secondary_class: string;
  reputation: number;
  active_title?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Minecraft Stats Explorer');
  
  // 1. HttpClient injizieren
  private http = inject(HttpClient);

  // 2. Ein Signal für die Spieler-Liste (Standardwert ist ein leeres Array)
  protected players = signal<PlayerStats[]>([]);
  
  // 3. Ein Signal für Fehlermeldungen
  protected errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.ladeSpielerDaten();
  }

  ladeSpielerDaten() {
    // Anfrage an das NestJS-Backend (Port 3000)
    this.http.get<PlayerStats[]>('http://localhost:3000/api/players').subscribe({
      next: (daten: PlayerStats[]) => {
        console.log('Daten erfolgreich empfangen:', daten);
        this.players.set(daten);
        this.errorMessage.set(null);
      },
      error: (fehler: HttpErrorResponse) => {
        console.error('Verbindungsfehler:', fehler);
        this.errorMessage.set('Konnte keine Verbindung zum Backend aufbauen.');
      }
    });
  }
}