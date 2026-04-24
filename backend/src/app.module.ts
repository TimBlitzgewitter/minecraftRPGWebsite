import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller'; // <-- WICHTIG: Import nicht vergessen!
import { AppService } from './app.service';       // <-- WICHTIG: Import nicht vergessen!
import { PlayerStats } from './player-stats.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [PlayerStats],
        synchronize: false,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([PlayerStats]),
  ],
  // Diese beiden Zeilen haben in meinem letzten Code-Beispiel gefehlt:
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}