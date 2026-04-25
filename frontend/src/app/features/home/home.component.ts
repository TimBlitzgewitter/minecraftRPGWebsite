import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ServerStatus {
  online: boolean;
  players: number;
  maxPlayers: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private http = inject(HttpClient);

  // Holt die Daten vom Backend, sobald die Seite lädt
  private statusRequest$ = this.http.get<ServerStatus>('http://localhost:3000/api/server-status').pipe(
    catchError(() => of({ online: false, players: 0, maxPlayers: 0 }))
  );

  serverStatus = toSignal(this.statusRequest$, { 
    initialValue: { online: false, players: 0, maxPlayers: 0 } 
  });
}