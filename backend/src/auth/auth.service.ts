import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebUser } from '../users/web-user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(WebUser)
    private readonly webUserRepository: Repository<WebUser>,
    private readonly jwtService: JwtService,
  ) {}

  async validateDiscordUser(details: { discordId: string; discordName: string; avatarId: string; discord_email: string }) {
    let user = await this.webUserRepository.findOne({ where: { discordId: details.discordId } });
    if (user) return { user, status: 'LOGGED_IN' };

    let emailUser = await this.webUserRepository.findOne({ where: { email: details.discord_email } });
    if (emailUser && !emailUser.discordId) {
        return { user: emailUser, status: 'MERGE_SUGGESTION' };
    }

    const newUser = this.webUserRepository.create({
        discordId: details.discordId,
        discordName: details.discordName,
        avatar: details.avatarId,
        discord_email: details.discord_email,
    });
    return { user: await this.webUserRepository.save(newUser), status: 'REGISTERED' };
  }

  async createPureDiscordUser(details: { discordId: string; discordName: string; avatarId: string; discord_email: string }) {
    let user = await this.webUserRepository.findOne({ where: { discordId: details.discordId } });

    if (!user) {
      user = this.webUserRepository.create({
        discordId: details.discordId,
        discordName: details.discordName,
        avatar: details.avatarId,
        discord_email: details.discord_email,
        isMerged: true 
      });
      user = await this.webUserRepository.save(user);
    }

    // Das Ausrufezeichen (!) sagt TypeScript: "Vertrau mir, user ist hier 100% nicht mehr null!"
    return { token: this.generateJwt(user!) };
  }

  // 2. Anpassung: mergeDiscordAccount
  async mergeDiscordAccount(details: { email: string; discordId: string; discordName: string; avatarId: string }) {
    let user = await this.webUserRepository.findOne({ where: { email: details.email } });
    
    // Wenn kein User zum Mergen gefunden wurde, brechen wir ab!
    if (!user) {
      throw new NotFoundException('Der zu verknüpfende Account wurde nicht gefunden.');
    }

    // Ab hier weiß TypeScript: user existiert garantiert.
    user.discordId = details.discordId;
    user.discordName = details.discordName;
    user.avatar = details.avatarId;
    user.isMerged = true;
    await this.webUserRepository.save(user);

    return { token: this.generateJwt(user) };
  }

  generateJwt(user: WebUser) {
    // Sicherheitsprüfung, falls der User nicht gefunden wurde
    if (!user) return null;
    
    const payload = { sub: user.id, 
      discordId: user.discordId, 
      discordName: user.discordName,
      avatar: user.avatar,      
      role: user.role };
    return this.jwtService.sign(payload);
  }
}