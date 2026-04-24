// src/app.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('✅ Datenbank-Verbindung erfolgreich hergestellt!');
      console.log(`Verbunden mit: ${this.dataSource.options.database}`);
    } else {
      console.error('❌ Datenbank-Verbindung fehlgeschlagen!');
    }
  }
}