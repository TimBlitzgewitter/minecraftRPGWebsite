import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-discord';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private configService: ConfigService) {
    // übergeben Passport den Schlüssel aus der .env Datei
    super({
      clientID: configService.get<string>('DISCORD_CLIENT_ID')!,
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('DISCORD_CALLBACK_URL')!,
      // Scopes bestimmen, was wir von Discord wissen wollen (hier: Identität und E-Mail)
      scope: ['identify', 'email'], 
    });
  }

  // wird AUTOMATISCH aufgerufen, sobald der User von Discord zurückkehrt
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    
    // extrahieren wichtigsten Daten aus dem Discord-Profil
    const { id, username, avatar, email } = profile;
    
    // sauberes Objekt
    const user = {
      discordId: id,
      discordName: username,
      avatarId: avatar,
      discord_email: email,
    };

    return user; 
  }
}