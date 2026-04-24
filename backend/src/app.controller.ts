import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerStats } from './player-stats.entity';

@Controller('api') // Haupt-Pfad
export class AppController {
  constructor(
    // Hier laden wir die Verbindung zu deiner MySQL-Tabelle
    @InjectRepository(PlayerStats)
    private playerRepo: Repository<PlayerStats>,
  ) {}

  @Get('players') // <-- Das löst deinen 404 Fehler!
  async getAllPlayers() {
    // Holt alle Einträge aus der Tabelle 'player_stats'
    return await this.playerRepo.find();
  }
}