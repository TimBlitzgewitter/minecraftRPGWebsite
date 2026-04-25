import { Controller, Get, Post, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerStats } from './player-stats.entity';
import * as util from 'minecraft-server-util';

@Controller('api') // Haupt-Pfad
export class AppController {
  constructor(
    @InjectRepository(PlayerStats)
    private playerRepo: Repository<PlayerStats>,
  ) {}

  // 1. Die normale Abfrage (wird beim ersten Laden der Website ausgeführt)
  @Get('players')
  async getAllPlayers() {
    return await this.playerRepo.find();
  }

  // 2. NEU: Der Befehl für deinen "Daten aktualisieren" Button
  @Post('force-sync')
  async forceSync() {
    try {
      // A. Sende den Befehl an dein Java-Plugin. 
      // WICHTIG: Ändere die IP und den Port auf die Daten deines Minecraft-Servers!
      const pluginResponse = await fetch('http://DEINE_MINECRAFT_IP:8080/sync', {
        method: 'POST', // Ein POST-Request ist Standard für Aktionen/Befehle
      });

      // B. Prüfen, ob das Plugin erfolgreich gespeichert hat
      if (!pluginResponse.ok) {
        throw new Error('Plugin hat Fehler gemeldet');
      }

      console.log('✅ Force Sync erfolgreich! Neue Daten aus MySQL laden...');
      
      // C. Hole die frisch geschriebenen Daten aus der MySQL-Datenbank
      return await this.playerRepo.find();

    } catch (error: any) {
      // D. Falls der Minecraft-Server aus ist oder die IP falsch ist
      console.error('❌ Fehler beim Force Sync:', error.message);
      
      // Sende einen sauberen Fehler an das Angular-Frontend zurück
      throw new HttpException(
        'Minecraft-Server ist nicht erreichbar oder synchronisiert nicht.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get('server-status')
  async getServerStatus() {
    try {
    
      const result = await util.status('193.187.255.36', 20190);
      
      return {
        online: true,
        players: result.players.online,
        maxPlayers: result.players.max,
        motd: result.motd.clean // Die Nachricht des Tages
      };
    } catch (error) {
      // Wenn der Server offline ist
      return {
        online: false,
        players: 0,
        maxPlayers: 0
      };
    }
  }
}