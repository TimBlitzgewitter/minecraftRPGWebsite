import { Controller, Get, UseGuards, Req, Res, Post, Body } from '@nestjs/common';
import { DiscordAuthGuard } from './discord.guard';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('api/auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  @Get('discord')
  @UseGuards(DiscordAuthGuard)
  async discordLogin() {}

  // Die Heimkehr von Discord
  @Get('discord/callback')
  @UseGuards(DiscordAuthGuard)
  async discordCallback(@Req() req: Request, @Res() res: Response) {
    const discordData = req.user as any;
    const result = await this.authService.validateDiscordUser(discordData);

    if (result.status === 'MERGE_SUGGESTION') {
      // WICHTIG: Wir übergeben jetzt auch Name und Avatar in der URL!
      return res.redirect(`http://localhost:4200/auth/merge-accounts?email=${result.user.email}&discordId=${discordData.discordId}&name=${discordData.discordName}&avatar=${discordData.avatarId}`);
    }

    const token = this.authService.generateJwt(result.user);
    res.redirect(`http://localhost:4200/home?token=${token}`);
  }

  // Endpunkt für: "Nein, separaten Account erstellen"
  @Post('confirm-separate-account')
  async confirmSeparate(@Body() data: any) {
    return await this.authService.createPureDiscordUser(data);
  }

  // NEU: Endpunkt für: "Ja, Accounts zusammenführen"
  @Post('confirm-merge')
  async confirmMerge(@Body() data: any) {
    return await this.authService.mergeDiscordAccount(data);
  }
}