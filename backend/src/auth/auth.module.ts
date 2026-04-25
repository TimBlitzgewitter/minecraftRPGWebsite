import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DiscordStrategy } from './discord.strategy';
import { AuthService } from './auth.service'; // <-- NEU
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'; // <-- NEU
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- NEU
import { WebUser } from '../users/web-user.entity'; // <-- NEU

@Module({
  imports: [
    PassportModule, 
    ConfigModule,
    TypeOrmModule.forFeature([WebUser]), // Erlaubt Zugriff auf die Datenbank
    // Richtet das JWT-System mit deinem geheimen Passwort ein
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' }, // Der Login hält 7 Tage
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [DiscordStrategy, AuthService], // AuthService hier eintragen
})
export class AuthModule {}