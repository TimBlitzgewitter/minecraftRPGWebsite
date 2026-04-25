import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

export interface PlayerStats {
  uuid: string;
  level: number;
  reputation: number;
  merits: number;
  class: string;
  active_title?: string | null;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css'
})
export class Leaderboard {
  private http = inject(HttpClient);

  // 1. Leaderboard holt sich die Daten jetzt selbst!
  private playersRequest$ = this.http.get<PlayerStats[]>('http://localhost:3000/api/players').pipe(
    catchError(error => {
      console.error('Fehler beim Laden des Leaderboards:', error);
      return of([]); // Fallback bei Fehler
    })
  );

  // 'players' ist wieder ein normales Signal (kein input mehr), gefüllt durch toSignal
  players = toSignal(this.playersRequest$, { initialValue: [] }); 

  sortColumn = signal<keyof PlayerStats>('level');
  sortDirection = signal<'asc' | 'desc'>('desc');

  sortedPlayers = computed(() => {
    const data = [...this.players()]; 
    const col = this.sortColumn();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;

    return data.sort((a, b) => {
      const valA = a[col] ?? 0;
      const valB = b[col] ?? 0;
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  });

  setSort(column: keyof PlayerStats) {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('desc');
    }
  }
}